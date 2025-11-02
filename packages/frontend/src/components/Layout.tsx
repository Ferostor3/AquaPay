import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Droplet, Home, Wallet, FileText, PiggyBank, CreditCard, Settings } from 'lucide-react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const location = useLocation()

  // Encontrar el conector de MetaMask específicamente
  const metaMaskConnector = connectors.find((c) => c.id === 'metaMask' || c.name === 'MetaMask')
  const injectedConnector = connectors.find((c) => c.id === 'injected' && !c.name?.includes('MetaMask'))
  
  const handleConnect = () => {
    // Priorizar MetaMask si está disponible, sino usar injected
    const connectorToUse = metaMaskConnector || injectedConnector || connectors[0]
    if (connectorToUse) {
      connect({ connector: connectorToUse })
    }
  }

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Wallet },
    { path: '/bills', label: 'Facturas', icon: FileText },
    { path: '/savings', label: 'Ahorros', icon: PiggyBank },
    { path: '/loans', label: 'Préstamos', icon: CreditCard },
    { path: '/admin', label: 'Admin', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Droplet className="w-8 h-8 text-primary-500" />
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                AquaPay <span className="text-primary-500">Web3</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {chain?.name || 'Unknown Network'}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isPending ? 'Conectando...' : 'Conectar MetaMask'}
                </button>
              )}
              {error && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            💧 AquaPay Web3 - Democratizando el acceso al agua con finanzas abiertas, pagos justos y tecnología blockchain
          </p>
        </div>
      </footer>
    </div>
  )
}

