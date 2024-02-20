/**
 * BurnPix Token IDs as Byte32 Hex
 *
 * Set names to differenciate all the
 * different token IDs and exchange their
 * values with your own token IDs
 */
export enum TOKEN_ID {
  GLOBE_N_SQUARE = '0x000000000000000000000000f983826c478d89fdb89e9a0d99e70a843fa97635',
  BLUE_BUBBLES = '0x0000000000000000000000006e6a0f9af08d88abaf1f6729b20395517ec51b43',
  SLIM_DRAGON = '0x000000000000000000000000dd55a140dc10f13babc567905a0198824fccba65',
  BURNT_STAR = '0x000000000000000000000000f5603116f71d29e26b9f4cdcc6242a888ccc9900',
}

/**
 * Iterations as Byte32 Hex
 *
 * Default is the minimum number possible per block:
 * 2000 (07d0)
 *
 * Common values:
 * 5000 (1388)
 * 4000 (0fa0)
 * 3000 (0bb8)
 * 2000 (07d0)
 * 1000 (03e8)
 * 889  (0379)
 * 111  (006f)
 *
 * https://neptunemutual.com/web3-tools/number-to-bytes32-converter/
 */
export const ITERATION_NUMBER =
  '0x00000000000000000000000000000000000000000000000000000000000007d0';

/**
 * Minimum LYX Balance of your controller
 * Set to 0.15 so transactions don't fail.
 */
export const MIN_LYX_BALANCE = 0.15;

// Maximum Gas Price in Gwei to execute the transaction
export const MAX_GAS_PRICE = 2;

// Burnt Pix Contract Addresses on LUKSO Mainnet
export enum BURNT_PIX_CONTRACT {
  'luksoMainnet' = '0x3983151E0442906000DAb83c8b1cF3f2D2535F82',
  'luksoTestnet' = '0x12167f1c2713aC4f740B4700c4C72bC2de6C686f',
}

// Terminal UI
export const SPLITTER =
  '-----------------------------------------------------------------------------------------------';
