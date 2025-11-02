import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, BILLING_ABI } from '../../config/contracts'
import { X, Loader, CheckCircle } from 'lucide-react'

interface CreateBillModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateBillModal({ isOpen, onClose }: CreateBillModalProps) {
  const [userAddress, setUserAddress] = useState('')
  const [consumption, setConsumption] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [ipfsHash, setIpfsHash] = useState('')
  const [metadata, setMetadata] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userAddress || !consumption || !dueDate) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    // Convertir fecha a timestamp
    const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000)
    
    writeContract({
      address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
      abi: BILLING_ABI,
      functionName: 'createBill',
      args: [
        userAddress as `0x${string}`,
        BigInt(parseInt(consumption)),
        BigInt(dueDateTimestamp),
        ipfsHash || '',
        metadata || '{}',
      ],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nueva Factura
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección del Usuario *
            </label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Consumo (litros) *
            </label>
            <input
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="1000"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hash IPFS (opcional)
            </label>
            <input
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Qm..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metadata JSON (opcional)
            </label>
            <textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"period": "Enero 2024"}'
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
                ¡Factura creada exitosamente!
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
                <span>Crear Factura</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


