import { useState, useEffect } from 'react'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, BILLING_ABI } from '../../config/contracts'
import { formatEther, parseEther } from '../../lib/utils'
import { X, Loader, CheckCircle, Settings } from 'lucide-react'

interface PriceConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PriceConfigModal({ isOpen, onClose }: PriceConfigModalProps) {
  const [newPrice, setNewPrice] = useState('')

  const { data: currentPrice, isLoading: isLoadingPrice } = useReadContract({
    address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
    abi: BILLING_ABI,
    functionName: 'pricePerLiter',
    query: {
      enabled: isOpen,
    },
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (currentPrice) {
      // Convertir de wei a unidades legibles (ajustar según los decimales)
      setNewPrice(formatEther(currentPrice, 18))
    }
  }, [currentPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPrice || parseFloat(newPrice) <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0')
      return
    }

    // Convertir precio a unidades del contrato (ajustar según decimales)
    const priceInWei = parseEther(newPrice, 18)
    
    writeContract({
      address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
      abi: BILLING_ABI,
      functionName: 'setPricePerLiter',
      args: [priceInWei],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configurar Precio por Litro
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isLoadingPrice ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando precio actual...</p>
            </div>
          ) : (
            <>
              {currentPrice && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium">Precio actual:</span>{' '}
                    {formatEther(currentPrice, 18)} unidades por litro
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nuevo Precio por Litro *
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0.001"
                  step="0.000001"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Ingresa el precio en unidades del token (ej: 0.001 = 0.001 unidades por litro)
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Error: {error.message}
                  </p>
                </div>
              )}

              {isSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-300">
                    ¡Precio actualizado exitosamente!
                  </p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {(isPending || isConfirming) ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>{isConfirming ? 'Confirmando...' : 'Enviando...'}</span>
                    </>
                  ) : (
                    <span>Actualizar Precio</span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}


