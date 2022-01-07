import { TokenInstructions } from "@project-serum/serum";
import { PublicKey } from "@solana/web3.js";
import { keypair } from "../connection";
import { sendTransaction } from "./sendTransaction";

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
        owner: keypair.publicKey,
      }),
    ],
    [],
    [keypair]
  );
}
