// packages/frontend/src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AQUAPAY_CONTRACT: string
    readonly VITE_BILLING_CONTRACT: string
    readonly VITE_MICROCREDIT_CONTRACT: string
    readonly VITE_SAVINGSPOOL_CONTRACT: string
    readonly VITE_STABLECOIN_CONTRACT: string
    readonly VITE_AQUAPAY_CONTRACT_MAINNET: string
    readonly VITE_BILLING_CONTRACT_MAINNET: string
    readonly VITE_MICROCREDIT_CONTRACT_MAINNET: string
    readonly VITE_SAVINGSPOOL_CONTRACT_MAINNET: string
    readonly VITE_STABLECOIN_CONTRACT_MAINNET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}