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

#### Twap Swap

The required arguments are `From`, `To`, `Amount` and `Interval`. 

- From and To: are the direction of the trading pair we want to swap.
- Amount: is the `From token` amount we want to swap for the `To token`.
- Interval: is the duration (like 10s, 10m, 10h) interval to execute a swap.

Example:

```sh
yarn start twap --from USDC --to PRT --amount 100 --interval 10m
```

> It will buy 100 USDC worth of PRT every 10 minutes

### Transfer amount

Optional you can specify a `TransferAddress` and `TransferThreshold` with the arguments  `--transferAddress` and `--transferThreshold` respectively. 

When the balance of the buying asset reach the `TransferThreshold`, all it's balance will be transfer to the `TransferAddress` associated token account.

Example:

```sh
yarn start twap --from USDC --to PRT --amount 100 --interval 10m --transferThreshold 100000 --transferAddress FRnCC8dBCcRabRv8xNbR5WHiGPGxdphjiRhE2qJZvwpm
```

> It will buy 100 USDC worth of PRT every 10 minutes and it will transfer all the PRT balance to the Parrot Protocol address once greater than 100,000 PRT

### Price Threshold

Optional you can specify a swap `PriceThreshold` with the argument `--priceThreshold`.

When CoinGecko price for the `To token` goes below the `PriceThreshold`, the swap will be execute otherwise it will skip and wait for the next interval.

Example:

```sh
yarn start twap --from USDC --to PRT --amount 100 --interval 10m --priceThreshold 0.015
```

> It will buy 100 USDC worth of PRT every 10 minutes only if PRT price on CoinGecko goes below 0.015.