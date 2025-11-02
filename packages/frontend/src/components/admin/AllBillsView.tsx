import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACTS, BILLING_ABI } from '../../config/contracts'
import { formatEther } from '../../lib/utils'
import { FileText, Loader, CheckCircle, Clock, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function AllBillsView() {
  const [searchAddress, setSearchAddress] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  const { data: bills, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
    abi: BILLING_ABI,
    functionName: 'getUserBills',
    args: [selectedAddress as `0x${string}` || '0x'],
    query: {
      enabled: !!selectedAddress && selectedAddress.length === 42 && selectedAddress.startsWith('0x'),
    },
  })

  const handleSearch = () => {
    if (searchAddress && searchAddress.startsWith('0x') && searchAddress.length === 42) {
      setSelectedAddress(searchAddress)
    } else {
      alert('Por favor ingresa una dirección válida (0x...)')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Buscar Facturas por Usuario
        </h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
        {selectedAddress && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Mostrando facturas para: {selectedAddress.slice(0, 6)}...{selectedAddress.slice(-4)}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
          <p className="text-red-800 dark:text-red-300">
            Error al cargar facturas: {error.message}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando facturas...</p>
        </div>
      )}

      {!selectedAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Ingresa una dirección de usuario para ver sus facturas
          </p>
        </div>
      )}

      {selectedAddress && !isLoading && bills && (bills as any[]).length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron facturas para este usuario
          </p>
        </div>
      )}

      {selectedAddress && !isLoading && bills && (bills as any[]).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Facturas Encontradas: {(bills as any[]).length}
          </h3>
          {(bills as any[]).map((bill: any, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {bill.isPaid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Factura #{bill.billId.toString()}
                    </h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Usuario</p>
                      <p className="font-mono text-gray-900 dark:text-white">
                        {bill.user}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Consumo</p>
                      <p className="text-gray-900 dark:text-white">
                        {bill.consumption.toString()} litros
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Monto</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatEther(bill.amount, 6)} USDC
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Vencimiento</p>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(Number(bill.dueDate) * 1000), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Creada</p>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(Number(bill.createdAt) * 1000), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Estado</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bill.isPaid
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {bill.isPaid ? 'Pagada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


