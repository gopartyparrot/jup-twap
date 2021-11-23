import { Transaction, TransactionInstruction, Keypair } from "@solana/web3.js";
import { connection, wallet } from "../connection";

export async function sendTransaction(
  instructions: TransactionInstruction[],
  cleanUpInstructions: TransactionInstruction[],
  signers: Keypair[],
  skipPreflight = true,
  simulate = false
) {
  let txId = "";
  const transaction = new Transaction();
  try {
    transaction.add(...instructions, ...cleanUpInstructions);

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    await wallet.signTransaction(transaction);
    signers
      .filter((s) => s !== undefined)
      .forEach((kp) => {
        transaction.partialSign(kp);
      });

    if (simulate) {
      const res = await connection.simulateTransaction(transaction);
      console.log("Simulates response", res);
    }

    const rawTx = transaction.serialize();

    txId = await connection.sendRawTransaction(rawTx, {
      skipPreflight,
    });
  } catch (error) {
    throw error;
  }
  return { txId, transaction };
}
