import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { CONTRACTS, AQUAPAY_ABI, ERC20_ABI } from '../config/contracts'
import { formatEther, parseEther } from '../lib/utils'
import { Loader, AlertCircle } from 'lucide-react'

export default function Payment() {
  const { billId } = useParams()
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stablecoin' | 'qr' | 'whatsapp'>('stablecoin')
  const [qrValue, setQrValue] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { data: balance } = useReadContract({
    address: CONTRACTS.scrollSepolia.stablecoin as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const handleStablecoinPayment = async () => {
    if (!address || !amount) return

    try {
      // Primero aprobar el gasto
      writeContract({
        address: CONTRACTS.scrollSepolia.stablecoin as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.scrollSepolia.aquaPay as `0x${string}`, parseEther(amount, 6)],
      })

      // Luego realizar el pago
      writeContract({
        address: CONTRACTS.scrollSepolia.aquaPay as `0x${string}`,
        abi: AQUAPAY_ABI,
        functionName: 'payWithStablecoin',
        args: [parseEther(amount, 6), BigInt(billId || '0'), ''],
      })
    } catch (err) {
      console.error('Payment error:', err)
    }
  }

  const generateQR = () => {
    const paymentData = {
      contract: CONTRACTS.scrollSepolia.aquaPay,
      amount,
      billId: billId || '0',
      recipient: address,
    }
    setQrValue(JSON.stringify(paymentData))
  }

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Realizar Pago</h1>

      {/* Payment Method Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Método de Pago
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {(['stablecoin', 'qr', 'whatsapp'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === method
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="capitalize font-medium">{method}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stablecoin Payment */}
      {paymentMethod === 'stablecoin' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              step="0.01"
            />
            {balance && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Balance disponible: {formatEther(balance, 6)} USDC
              </p>
            )}
          </div>

          <button
            onClick={handleStablecoinPayment}
            disabled={!amount || isPending}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {isPending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Pagar con Stablecoin</span>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">Error: {error.message}</p>
            </div>
          )}
        </div>
      )}

      {/* QR Payment */}
      {paymentMethod === 'qr' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
            />
          </div>

          <button
            onClick={generateQR}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Generar Código QR
          </button>

          {qrValue && (
            <div className="flex justify-center pt-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={qrValue} size={256} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Payment */}
      {paymentMethod === 'whatsapp' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Para pagar vía WhatsApp, escanea el código QR o envía un mensaje al número de servicio
          </p>
          <a
            href={`https://wa.me/521234567890?text=Pago%20de%20agua%20${billId || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
          >
            Abrir WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

