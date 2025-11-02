import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { CONTRACTS, MICROCREDIT_ABI, ERC20_ABI } from '../config/contracts'
import { formatEther, parseEther } from '../lib/utils'
import { CreditCard, Plus, AlertCircle, Loader } from 'lucide-react'

export default function Loans() {
  const { address, isConnected } = useAccount()
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [purpose, setPurpose] = useState('')

  const { data: loans, isLoading } = useReadContract({
    address: CONTRACTS.scrollSepolia.microCredit as `0x${string}`,
    abi: MICROCREDIT_ABI,
    functionName: 'getBorrowerLoans',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { writeContract, isPending } = useWriteContract()

  const handleRequestLoan = async () => {
    if (!address || !loanAmount || !loanTerm || !purpose) return

    try {
      writeContract({
        address: CONTRACTS.scrollSepolia.microCredit as `0x${string}`,
        abi: MICROCREDIT_ABI,
        functionName: 'requestLoan',
        args: [parseEther(loanAmount, 6), BigInt(parseInt(loanTerm)), purpose],
      })
    } catch (err) {
      console.error('Loan request error:', err)
    }
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Microcréditos</h1>

      {/* Request Loan Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Solicitar Préstamo
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto (USDC)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plazo (días)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Propósito
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ej: Pago de factura de agua pendiente"
              rows={3}
            />
          </div>
          <button
            onClick={handleRequestLoan}
            disabled={!loanAmount || !loanTerm || !purpose || isPending}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {isPending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Solicitar Préstamo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loans List */}
      {isLoading ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        </div>
      ) : loans && (loans as any[]).length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mis Préstamos</h2>
          {(loans as any[]).map((loan: any, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Préstamo #{loan.loanId.toString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monto: {formatEther(loan.amount, 6)} USDC
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tasa de interés: {(Number(loan.interestRate) / 100).toFixed(2)}%
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    loan.isRepaid
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : loan.isActive
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {loan.isRepaid ? 'Pagado' : loan.isActive ? 'Activo' : 'Cerrado'}
                </span>
              </div>
              {loan.isActive && !loan.isRepaid && (
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  Pagar Préstamo
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No tienes préstamos registrados</p>
        </div>
      )}
    </div>
  )
}


