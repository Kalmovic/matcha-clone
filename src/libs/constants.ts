import type { Address } from "wagmi";

export const MAX_ALLOWANCE = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

export const exchangeProxy = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

/* type Token = {
  address: Address;
}; */

interface Token {
  id?: string;
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  chainId?: number;
  logoURI: string;
}

// {
//   // id: "0x",
//   address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
//   decimals: 18,
//   symbol: "zrx",
//   name: "0x Protocol",
//   logoURI:
//     "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0xe41d2489571d322189246dafa5ebde1f4699f498/logo.png",
// },
// {
//   id: "weth",
//   symbol: "weth",
//   name: "WETH",
//   decimals: 18,
//   address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//   logoURI:
//     "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png",
// },

export const POLYGON_TOKENS: Token[] = [
  {
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
  },
  {
    chainId: 137,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  {
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  {
    chainId: 137,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  {
    chainId: 137,
    name: "Tether USD - PoS",
    symbol: "USDT",
    decimals: 6,
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
];

export const POLYGON_TOKENS_BY_SYMBOL: Record<string, Token> = {
  wmatic: {
    id: "wmatic",
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
  },
  dai: {
    id: "dai",
    chainId: 137,
    name: "Dai",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  usdc: {
    id: "usd-coin",
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  uni: {
    id: "uniswap",
    chainId: 137,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  usdt: {
    id: "tether",
    chainId: 137,
    name: "Tether USD - PoS",
    symbol: "USDT",
    decimals: 6,
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
};

export const VS_CURRENCIES = [
  { currency: "usd", name: "US Dollar" },
  { currency: "eur", name: "Euro" },
  { currency: "gbp", name: "British Pound" },
  { currency: "jpy", name: "Japanese Yen" },
  { currency: "cny", name: "Chinese Yuan" },
  // { currency: "btc", name: "Bitcoin" },
  { currency: "eth", name: "Ethereum" },
  { currency: "ltc", name: "Litecoin" },
  // { currency: "bch", name: "Bitcoin Cash" },
  { currency: "xrp", name: "Ripple (XRP)" },
];

export const TIME_PERIODS = [
  {
    days: "1",
    name: "1D",
    description: "Day",
  },
  {
    days: "7",
    name: "1W",
    description: "Week",
  },
  {
    days: "30",
    name: "1M",
    description: "Month",
  },
  {
    days: "365",
    name: "1Y",
    description: "Year",
  },
];

export const TIME_PERIODS_BY_DAYS: Record<
  string,
  {
    name: string;
    description: string;
    formatDate: string;
    interval?: string;
  }
> = {
  "1": {
    name: "1D",
    description: "Day",
    formatDate: "HH:mm",
    interval: "",
  },
  "7": {
    name: "1W",
    description: "Week",
    formatDate: "dd/MM",
    interval: "daily",
  },
  "30": {
    name: "1M",
    description: "Month",
    formatDate: "dd/MM",
    interval: "daily",
  },
  "365": {
    name: "1Y",
    description: "Year",
    formatDate: "dd/MM",
    interval: "daily",
  },
};

export const POLYGON_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": {
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
  },
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": {
    chainId: 137,
    name: "DAI - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": {
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  "0xb33eaad8d922b1083446dc23f610c2567fb5180f": {
    chainId: 137,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  },
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": {
    chainId: 137,
    name: "Tether USD - PoS",
    symbol: "USDT",
    decimals: 6,
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
};
