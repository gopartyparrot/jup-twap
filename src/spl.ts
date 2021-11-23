import { TokenInstructions } from "@project-serum/serum";
import { PublicKey } from "@solana/web3.js";
import { wallet } from "./connection";
import { sendTransaction } from "./utils/sendTransaction";

export async function transferToken(
  fromTokenAccount: PublicKey,
  toTokenAccount: PublicKey,
  amount: number
) {
  return sendTransaction(
    [
      TokenInstructions.transfer({
        source: fromTokenAccount,
        destination: toTokenAccount,
        amount: amount,
        owner: wallet.publicKey,
      }),
    ],
    [],
    [wallet.payer]
  );
}
