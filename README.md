## Jup Twap

Twap buy/sell (swap) using [Jupiter aggregator](https://jup.ag/)

- [@jup-ag/core](https://www.npmjs.com/package/@jup-ag/core)

## Getting Started

First you need to copy the `.env.example` to `.env` and set the `RPC_URL` and `WALLET_PK` respectively.

> `WALLET_PK` is a Base58 private key and it can be exported from `Phantom Wallet`

## Running

```sh
yarn build
```

and then 

```sh
yarn start
```

### Swap 10 USDC for PRT

```sh
yarn start twap --from USDC --to PRT --amount 0.1 --interval 10m
```