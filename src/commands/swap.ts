import { Jupiter } from "@jup-ag/core";
import { PublicKey } from "@solana/web3.js";
import { connection, wallet } from "../connection";
import { TOKENS } from "../constants";

interface SwapArgs {
  from: string;
  to: string;
  amount: number;
  slippage?: number;
}

let jupiter: Jupiter;

export async function swapCommand({
  from,
  to,
  amount,
  slippage = 2, // default 2%
}: SwapArgs): Promise<string> {
  const fromToken = TOKENS[from];
  const toToken = TOKENS[to];

  if (!fromToken) {
    throw new Error(`token ${from} not found in TOKENS config`);
  }

  if (!toToken) {
    throw new Error(`token ${to} not found in TOKENS config`);
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
    if (!possiblePairs.filter((i) => i === toToken.mint).length) {
      throw new Error(`could not find routing for ${from}`);
    }
  }

  const intAmount = amount * 10 ** fromToken.decimals;

  if (Number.isNaN(intAmount) || intAmount <= 0) {
    throw new Error(`swap amount not valid ${amount}`);
  }

  // Calculate routes for swapping [amount] [from] to [to] with 2% slippage
  // routes are sorted based on outputAmount, so ideally the first route is the best.
  const routes = await jupiter.computeRoutes(
    new PublicKey(fromToken.mint),
    new PublicKey(toToken.mint),
    intAmount,
    slippage
  );

  // Prepare execute exchange
  const { execute } = await jupiter.exchange({
    route: routes[0],
  });

  // Swap execute
  const swapResult = await execute();

  if (Object.keys(swapResult).includes("error")) {
    throw new Error(`swap result error: ${swapResult}`);
  }

  return swapResult["txid"];
}
