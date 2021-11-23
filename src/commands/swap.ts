import { Jupiter } from "@jup-ag/core";
import { PublicKey } from "@solana/web3.js";
import {
  getTokenAccountAddress,
  ownerTokenAccounts,
  ownerTokenBalances,
  updateTokenBalances,
} from "../accounts";
import { getTokenPrice } from "../coingecko";

import { connection, wallet } from "../connection";
import { TOKENS } from "../constants";
import { logger } from "../logger";
import { transferToken } from "../spl";

interface SwapArgs {
  from: string;
  to: string;
  amount: number;
  transferAddress?: string;
  transferThreshold?: string;
  priceThreshold?: string;
  slippage?: number;
}

let jupiter: Jupiter;

const transferTokenAccounts: Record<string, PublicKey> = {};

export async function swapCommand(args: SwapArgs): Promise<string> {
  const fromToken = TOKENS[args.from];
  const toToken = TOKENS[args.to];

  if (!fromToken) {
    throw new Error(`token ${args.from} not found in TOKENS config`);
  }

  if (!toToken) {
    throw new Error(`token ${args.to} not found in TOKENS config`);
  }

  await updateTokenBalances();

  const transferThreshold =
    Number(args.transferThreshold ?? 0) * 10 ** toToken.decimals;
  const priceThreshold = Number(args.priceThreshold ?? 0);
  const fromTokenAccount = ownerTokenAccounts[fromToken.mint];
  const toTokenAccount = ownerTokenAccounts[toToken.mint];
  const fromBalance =
    fromTokenAccount && ownerTokenBalances[fromTokenAccount.toBase58()];
  const toBalance =
    toTokenAccount && ownerTokenBalances[toTokenAccount.toBase58()];

  const swapAmount = args.amount * 10 ** fromToken.decimals;

  if (Number.isNaN(swapAmount) || swapAmount <= 0) {
    throw new Error(`swap amount not valid ${args.amount}`);
  }

  // Check from balance
  if (!fromBalance || fromBalance < swapAmount) {
    throw new Error(
      `from balance not enough for swap, need ${swapAmount} ${fromToken.symbol} only have ${fromBalance} ${fromToken.symbol}`
    );
  }

  // Check transfer balance
  if (
    toBalance &&
    toTokenAccount &&
    args.transferAddress &&
    transferThreshold > 0 &&
    toBalance > transferThreshold
  ) {
    let transferTokenAccount = transferTokenAccounts[toToken.mint];
    if (!transferTokenAccount) {
      transferTokenAccount = await getTokenAccountAddress(
        new PublicKey(args.transferAddress),
        new PublicKey(toToken.mint)
      );
      transferTokenAccounts[toToken.mint] = transferTokenAccount;
    }
    logger.info(
      `transfer threshold reached, transfer ${
        toToken.symbol
      } (${toBalance}) to ${transferTokenAccount.toBase58()}`
    );
    try {
      const res = await transferToken(
        toTokenAccount,
        transferTokenAccount,
        toBalance
      );
      logger.info(`transfer balance txID: ${res.txId}`);
    } catch (error) {
      logger.error(`transfer balance error: ${error}`);
    }
  }

  // Check we reach the price to start swap
  if (priceThreshold > 0 && toToken.coinGeckoID) {
    try {
      const currentPrice = await getTokenPrice(toToken.coinGeckoID);
      if (currentPrice > priceThreshold) {
        logger.info(
          `current price ${currentPrice} is greater than ${args.priceThreshold}, skip swap for now`
        );
        throw new Error("price threshold for swap not reached");
      }
    } catch (error) {
      logger.error(`price threshold check error: ${error}`);
    }
  }

  // load Jupiter once for this from/to pair
  if (!jupiter) {
    jupiter = await Jupiter.load({
      connection,
      cluster: "mainnet-beta",
      user: wallet.payer,
    });
    const routeMap = jupiter.getRouteMap();
    const possiblePairs = routeMap.get(fromToken.mint);
    if (!possiblePairs?.filter((i) => i === toToken.mint).length) {
      throw new Error(`could not find routing for ${args.from}`);
    }
  }

  // Calculate routes for swapping [amount] [from] to [to] with 2% slippage
  // routes are sorted based on outputAmount, so ideally the first route is the best.
  const routes = await jupiter.computeRoutes(
    new PublicKey(fromToken.mint),
    new PublicKey(toToken.mint),
    swapAmount,
    args.slippage ?? 2
  );

  if (!routes?.length) {
    throw new Error("route not found");
  }

  // Prepare execute exchange
  const { execute } = await jupiter.exchange({
    route: routes[0],
  });

  // Swap execute
  const swapResult = await execute();

  if (Object.keys(swapResult).includes("error")) {
    throw new Error(`swap result error: ${swapResult}`);
  }

  return (swapResult as any)["txid"];
}
