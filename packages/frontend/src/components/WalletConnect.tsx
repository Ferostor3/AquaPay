import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'
import { Wallet, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function WalletConnect() {
  const { address, isConnected, chain, isConnecting } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()

  // Encontrar MetaMask específicamente
  const metaMaskConnector = connectors.find(
    (c) => c.id === 'metaMask' || c.name === 'MetaMask'
  )
  const injectedConnector = connectors.find(
    (c) => c.id === 'injected' && !c.name?.includes('MetaMask')
  )

  const handleConnect = () => {
    const connectorToUse = metaMaskConnector || injectedConnector || connectors[0]
    if (connectorToUse) {
      connect({ connector: connectorToUse })
    }
  }

  const handleSwitchChain = () => {
    if (chain?.id !== scrollSepolia.id) {
      switchChain({ chainId: scrollSepolia.id })
    }
  }

  const isWrongChain = chain && chain.id !== scrollSepolia.id

  if (isConnected && address) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Wallet Conectada
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>

        {isWrongChain ? (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Red Incorrecta
              </p>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
              Estás conectado a {chain?.name}. Necesitas cambiar a Scroll Sepolia.
            </p>
            <button
              onClick={handleSwitchChain}
              disabled={isSwitchingChain}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isSwitchingChain ? (
                <>
                  <Loader className="w-4 h-4 animate-spin inline mr-2" />
                  Cambiando...
                </>
              ) : (
                'Cambiar a Scroll Sepolia'
              )}
            </button>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Red: {chain?.name || 'Scroll Sepolia'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => disconnect()}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Desconectar Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <Wallet className="w-8 h-8 text-primary-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conectar Wallet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conecta tu MetaMask para comenzar
          </p>
        </div>
      </div>

      {!metaMaskConnector && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">MetaMask no detectado</p>
              <p className="text-xs">
                Por favor, instala MetaMask desde{' '}
                <a
                  href="https://metamask.io/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  metamask.io
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-300">
              {error.message}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isPending || isConnecting || !metaMaskConnector}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center space-x-2"
      >
        {isPending || isConnecting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Conectar con MetaMask</span>
          </>
        )}
      </button>

      {metaMaskConnector && (
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          Al hacer clic, se abrirá MetaMask para autorizar la conexión
        </p>
      )}
    </div>
  )
}


