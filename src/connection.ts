import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

import { ENV } from "./constants";

export const keypair = Keypair.fromSecretKey(bs58.decode(ENV.walletPK));

export const connection = new Connection(ENV.rpcURL);
