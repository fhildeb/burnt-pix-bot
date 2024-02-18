# burnt-pix-bot

A Hardhat repository for automated redefindments of BurntPix NFTs.

## Installation

```bash
git clone git@github.com:fhildeb/burnt-pix-bot.git
cd burnt-pix-bot
bun install
```

## Preparation

1. Rename `.env.example` to `.env` and set your `PRIVATE_KEY`
2. Add your `TOKEN_ID` and names to [`/consts/constants.ts`](./scripts/redefineBurntPix.ts)
3. Set `burntPix` and `maximumRedefines` in [`/scripts/redefineBurntPix.ts`](./scripts/redefineBurntPix.ts)
4. Adjust `ITERATION_NUMBER`, `MAX_GAS_PRICE` in [`/consts/constants.ts`](./consts/constants.ts)

## Further Information

- **How to save gas**: Dont call redefine transactions using the Universal Profile. It will use significantly more gas because the transaction has to go through the smart contract account. Therefore, provide the `PRIVATE_KEY` of a separate Wallet or the [Universal Profile Controller](https://support.lukso.network/extension/controllers).
- **How to get the token ID** To get the `TOKEN_ID` of your BurntPix, connect your Universal Profile or wallet to the [BurntPix Webpage](https://burntpix.com/) and click redefine. It will pop up a transaction screen showing a `Smart Contract Execution` of `Method: 0xea255583`. The `[0]` value is the token ID of the Burnt Pix and can be copied.
- **How to get Byte32 values**: Both, the `ITERATION_NUMBER` and `TOKEN_ID` values have to be defined as Byte32 values as hexadecimal strings. You can use the [Byte32 Converter](https://neptunemutual.com/web3-tools/number-to-bytes32-converter/) to set custom iterations. Always make sure iterations and token IDs have the `0x` prefix in front.

## Execute the Script

```bash
# Mainnet
npx hardhat --network luksoMainnet run scripts/redefineBurntPix.ts

# Testnet
npx hardhat --network luksoTestnet run scripts/redefineBurntPix.ts
```

```text
-----------------------------------------------------------------------------------------------
--- Current Controller:  0xE929859839B0e624f88c169dcAdf5c662967691d
--- Current LYX Balance:  5.219111508945610286
--- Current Gas Price:  1.39763443
--- Getting Metadata for:  0x000000000000000000000000f5603116f71d29e26b9f4cdcc6242a888ccc9900
-----------------------------------------------------------------------------------------------
Iterations: 987000
GasUsed: 7.38B
FeesBurnt: 7.55LYX
TipsPaid: 3.91LYX
-----------------------------------------------------------------------------------------------
[23:05:19] Checking conditions for refinement...
--- Calling refine...
-----------------------------------------------------------------------------------------------
Previous refinement is still processing. Skipping this round.
-----------------------------------------------------------------------------------------------
Refine called successfully. Waiting for next round...
```

> Use `Ctrl+C` to terminate the script.

## References

- [Number to Byte32 Converter](https://neptunemutual.com/web3-tools/number-to-bytes32-converter/)
- [BurntPix Benchmark](https://github.com/karalabe/burntpix-benchmark)

#### Mainnet Links

- [Burntpix Website](https://burntpix.com/)
- [BurntPix Contract](https://explorer.execution.mainnet.lukso.network/address/0x3983151E0442906000DAb83c8b1cF3f2D2535F82?tab=contract)
- [LUKSO Gas Tracker](https://explorer.execution.mainnet.lukso.network/stats)

#### Testnet Links

- [Burntpix Website](https://testnet.burntpix.com/)
- [BurntPix Contract](https://explorer.execution.testnet.lukso.network/address/0x12167f1c2713aC4f740B4700c4C72bC2de6C686f?tab=contract)
- [LUKSO Gas Tracker](https://explorer.execution.testnet.lukso.network/stats)
