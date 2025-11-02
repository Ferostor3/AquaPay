import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS, BILLING_ABI } from '../config/contracts'
import { formatEther } from '../lib/utils'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function Bills() {
  const { address, isConnected } = useAccount()

  const { data: bills, isLoading } = useReadContract({
    address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
    abi: BILLING_ABI,
    functionName: 'getUserBills',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Conecta tu Wallet
        </h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando facturas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Facturas</h1>
        <Link
          to="/payment"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Realizar Pago
        </Link>
      </div>

      {!bills || (bills as any[]).length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No tienes facturas registradas</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(bills as any[]).map((bill: any, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {bill.isPaid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Factura #{bill.billId.toString()}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Consumo: {bill.consumption.toString()} litros
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monto: {formatEther(bill.amount, 6)} USDC
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vencimiento: {format(new Date(Number(bill.dueDate) * 1000), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  {bill.isPaid ? (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                      Pagada
                    </span>
                  ) : (
                    <Link
                      to={`/payment/${bill.billId.toString()}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Pagar Ahora
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


