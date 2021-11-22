export const ENV = {
  rpcURL: process.env.RPC_URL ?? "",
  walletPK: process.env.WALLET_PK ?? "",
};

interface TokenInfo {
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
}

export const TOKENS: Record<string, TokenInfo> = {
  SOL: {
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
  },
  USDC: {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
  },
  PAI: {
    name: "PAI",
    mint: "Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS",
    symbol: "PAI",
    decimals: 6,
  },
  PRT: {
    name: "PRT",
    mint: "PRT88RkA4Kg5z7pKnezeNH4mafTvtQdfFgpQTGRjz44",
    symbol: "PRT",
    decimals: 6,
  },
};
