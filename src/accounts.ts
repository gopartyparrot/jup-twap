import { PublicKey, AccountInfo } from "@solana/web3.js";
import { connection } from "./connection";
import { deserializeAccount, getATAAddress } from "@saberhq/token-utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const ownerTokenAccounts: Record<string, PublicKey | null> = {};
export const ownerTokenBalances: Record<string, number> = {};

export async function getTokenAccountAddress(
  ownerPk: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> {
  // for Native SOL token fake mint, use owner address
  if (mintPk.toBase58() === "So11111111111111111111111111111111111111111") {
    return ownerPk;
  }
  return getATAAddress({ owner: ownerPk, mint: mintPk });
}

export function getTokenAccountBalance(
  accountData: AccountInfo<Buffer> | null
) {
  if (!accountData) {
    return 0;
  }
  // for Token Program account owner use parseTokenAccountData
  if (accountData.owner.equals(TOKEN_PROGRAM_ID)) {
    const info = deserializeAccount(accountData.data);
    return info.amount.toNumber();
  }
  return accountData.lamports;
}

export async function updateTokenAccounts(ownerPk: PublicKey, mints: string[]) {
  const addressPks: PublicKey[] = [];
  for await (const mintPk of mints.map((i) => new PublicKey(i))) {
    addressPks.push(await getTokenAccountAddress(ownerPk, mintPk));
  }
  const result = await connection.getMultipleAccountsInfo(addressPks);

  result.forEach((account, index) => {
    ownerTokenAccounts[mints[index]] = account ? addressPks[index] : null;
    ownerTokenBalances[addressPks[index].toBase58()] =
      getTokenAccountBalance(account);
  });
}

export async function updateTokenBalances() {
  const addressPks = Object.values(ownerTokenAccounts).filter(
    (i) => !!i
  ) as PublicKey[];
  const result = await connection.getMultipleAccountsInfo(addressPks);
  result.forEach((account, index) => {
    ownerTokenBalances[addressPks[index].toBase58()] =
      getTokenAccountBalance(account);
  });
}
