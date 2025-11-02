import { scrollSepolia, scroll } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'
import { injected, metaMask } from 'wagmi/connectors'

// Scroll Sepolia Testnet (para desarrollo)
const chains = [scrollSepolia, scroll] as const

export const config = createConfig({
  chains,
  transports: {
    [scrollSepolia.id]: http('https://sepolia-rpc.scroll.io/'),
    [scroll.id]: http('https://rpc.scroll.io/'),
  },
  connectors: [
    injected(),
    metaMask(),
  ],
})

