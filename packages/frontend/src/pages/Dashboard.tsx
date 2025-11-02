import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS, AQUAPAY_ABI } from '../config/contracts'
import { formatAddress, formatEther } from '../lib/utils'
import { Droplet, Wallet, FileText, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import WalletConnect from '../components/WalletConnect'

export default function Dashboard() {
  const { address, isConnected, chain } = useAccount()

  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { data: userData } = useReadContract({
    address: CONTRACTS.scrollSepolia.aquaPay as `0x${string}`,
    abi: AQUAPAY_ABI,
    functionName: 'getUserInfo',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  useEffect(() => {
    if (userData) {
      setUserInfo(userData)
      setLoading(false)
    }
  }, [userData])

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto py-12">
        <WalletConnect />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando información...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {chain?.name} - {address && formatAddress(address)}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Droplet className="w-12 h-12 text-primary-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {userInfo?.ensName || 'Usuario no registrado'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Medidor: {userInfo?.waterMeterId || 'N/A'}
            </p>
          </div>
        </div>

        {!userInfo?.userAddress && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-300">
              No estás registrado en el sistema. Por favor, regístrate primero.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/payment"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Wallet className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Realizar Pago
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Paga tu factura con stablecoins o fiat
          </p>
        </Link>

        <Link
          to="/bills"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <FileText className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ver Facturas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Consulta tu historial de facturas y pagos
          </p>
        </Link>

        <Link
          to="/savings"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Wallet className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ahorros
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Gana intereses con tus ahorros
          </p>
        </Link>
      </div>
    </div>
  )
}

