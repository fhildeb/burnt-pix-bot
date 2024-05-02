# burnt-pix-bot

A Hardhat repository for automated refindments of Burnt Pix NFTs.

![Burnt Pix Preview](./img/burnt-pix-preview.png)

## Installation

**This repository uses the [bun](https://bun.sh) toolkit to manage packages and run scripts.Make sure to [install it](https://bun.sh/docs/installation) first.**

```bash
# Download repository
git clone https://github.com/fhildeb/burnt-pix-bot.git

# Open the folder
cd burnt-pix-bot

# Install dependencies
bun install
```

## Preparation

1. Rename `.env.example` to `.env` and set your `PRIVATE_KEY`
2. Add your `TOKEN_ID` and names to [`/consts/constants.ts`](./scripts/refineBurntPix.ts)
3. Update the `const burntPix` variable in [`/scripts/refineBurntPix.ts`](./scripts/refineBurntPix.ts) to match the new `TOKEN_ID` you have added. For example, change `const burntPix = TOKEN_ID.GLOBE_N_SQUARE;` to `const burntPix = TOKEN_ID.NEW_BURNT_PIX;` if `NEW_BURNT_PIX` is your new token ID. This ensures that the script interacts with the correct token ID.
4. Set `burntPix` and `maximumRefines` in [`/scripts/refineBurntPix.ts`](./scripts/refineBurntPix.ts)
5. Adjust `ITERATION_NUMBER` and `MAX_GAS_PRICE` in [`/consts/constants.ts`](./consts/constants.ts)

> **CAUTION**: Never share your private key with anyone or upload it to public repositories. Anyone who possesses it can access your funds, assets, or even gain access to your Universal Profile if the controller has administrative rights!

## Further Information

- **How to save gas**: Dont call refine transactions using the Universal Profile. It will use significantly more gas because the transaction has to go through the smart contract account. Therefore, provide the `PRIVATE_KEY` of a separate Wallet or the [Universal Profile Controller](https://support.lukso.network/extension/controllers). You can further optimize on the iteration number, as described below.
- **How to get the token ID** To get the `TOKEN_ID` of your Burnt Pix NFT, connect your Universal Profile or wallet to the [Burnt Pix Webpage](https://burntpix.com/) and click refine. It will pop up a transaction screen showing a `Smart Contract Execution` of `Method: 0xea255583`. The `[0]` value is the token ID of the Burnt Pix and can be copied.
- **How to get Byte32 values**: Both, the `ITERATION_NUMBER` and `TOKEN_ID` values have to be defined as Byte32 values as hexadecimal strings. You can use the [Byte32 Converter](https://neptunemutual.com/web3-tools/number-to-bytes32-converter/) to set custom iterations. Always make sure iterations and token IDs have the `0x` prefix in front.
- **How much will it cost**: Depending on the current gas price ranging from `0.75 Gwei` to `5 Gwei`, a transaction with 2000 refinements will range from `0.015 LYX` to `0.1 LYX`.
- **How to optimize iterations**: The number of iterations that can be completed within one block or transaction depends on how many pixels need to be refined. This number is different for every Burnt Pix NFT. If you choose a number that's _too high_, _iterations will abort_ mid-way and _cost you extra gas_. If you plan on doing many refinements, you can raise the iteration number to find the sweet spot of maximum iterations. A high number without abortions will make refinements faster and save gas, as fewer transactions must be fired.

## Execution

### Starting the Script

```bash
# Mainnet
npx hardhat --network luksoMainnet run scripts/refineBurntPix.ts

# Testnet
npx hardhat --network luksoTestnet run scripts/refineBurntPix.ts
```

### Terminal Output

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
--- Checking conditions for refinement...
--- Calling refine...
-----------------------------------------------------------------------------------------------
[23:05:19] Previous refinement is still processing. Skipping this round.
-----------------------------------------------------------------------------------------------
Refine called successfully. Waiting for next round...
```

> **EXIT**: Use `Ctrl+C` to terminate the script.

## References

- [Number to Byte32 Converter](https://neptunemutual.com/web3-tools/number-to-bytes32-converter/)
- [Burnt Pix Benchmark](https://github.com/karalabe/burntpix-benchmark)

#### Mainnet Links

- [Burnt Pix Website](https://burntpix.com/)
- [Burnt Pix Contract](https://explorer.execution.mainnet.lukso.network/address/0x3983151E0442906000DAb83c8b1cF3f2D2535F82?tab=contract)
- [LUKSO Gas Tracker](https://explorer.execution.mainnet.lukso.network/stats)

#### Testnet Links

- [Burnt Pix Website](https://testnet.burntpix.com/)
- [Burnt Pix Contract](https://explorer.execution.testnet.lukso.network/address/0x12167f1c2713aC4f740B4700c4C72bC2de6C686f?tab=contract)
- [LUKSO Gas Tracker](https://explorer.execution.testnet.lukso.network/stats)
