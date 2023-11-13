This is a [wagmi](https://wagmi.sh) + [ConnectKit](https://docs.family.co/connectkit) + [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi)

# About

This is a clone from [matcha](https://matcha.xyz/tokens/ethereum/eth) interface + functionality using 0x api for Swap and CoinGecko for price feed.

![Interface](interface-demo.png)

## Note

This is a work in progress, and is not ready for production use. It is not audited, and may contain bugs. Use at your own risk.

# Features

- Connect to a wallet using [ConnectKit](https://docs.family.co/connectkit)
- Swap tokens using [0x API](https://0x.org/docs/api) _(WIP)_
- Get token prices using [CoinGecko](https://www.coingecko.com/en/api)

## Roadmap

- [ ] Enable the user to switch tokens (that are being swapped) on the chart instead of just showing the sell token

# Getting Started

Run `npm run dev` in your terminal, and then open [localhost:3000](http://localhost:3000) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/pages/index.tsx`) will automatically update the webpage.

# Learn more

To learn more about [Next.js](https://nextjs.org), [ConnectKit](https://docs.family.co/connectkit) or [wagmi](https://wagmi.sh), check out the following resources:

- [wagmi Documentation](https://wagmi.sh) – learn about wagmi Hooks and API.
- [wagmi Examples](https://wagmi.sh/examples/connect-wallet) – a suite of simple examples using wagmi.
- [ConnectKit Documentation](https://docs.family.co/connectkit) – learn more about ConnectKit (configuration, theming, advanced usage, etc).
- [Next.js Documentation](https://nextjs.org/docs) learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
