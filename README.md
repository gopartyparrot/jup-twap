## Jup Twap

Twap swap using [Jupiter aggregator](https://jup.ag/)

Built using:

- [@jup-ag/core](https://www.npmjs.com/package/@jup-ag/core)
- [@icholy/duration](https://www.npmjs.com/package/@icholy/duration)

## Getting Started

First you need to copy the `.env.example` to `.env` and set the `RPC_URL` and `WALLET_PK` respectively.

> `WALLET_PK` is a Base58 private key and it can be exported from `Phantom Wallet`

## Building and Running

```sh
yarn build
```

and then 

```sh
yarn start
```

#### Swap 10 USDC for PRT every 10 minutes

```sh
yarn start twap --from USDC --to PRT --amount 10 --interval 10m
```