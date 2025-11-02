import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { CONTRACTS, SAVINGSPOOL_ABI, ERC20_ABI } from '../config/contracts'
import { formatEther, parseEther } from '../lib/utils'
import { PiggyBank, Plus, ArrowUpRight, Loader } from 'lucide-react'

export default function Savings() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('')

  const { data: deposits, isLoading } = useReadContract({
    address: CONTRACTS.scrollSepolia.savingsPool as `0x${string}`,
    abi: SAVINGSPOOL_ABI,
    functionName: 'getUserDeposits',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { data: totalBalance } = useReadContract({
    address: CONTRACTS.scrollSepolia.savingsPool as `0x${string}`,
    abi: SAVINGSPOOL_ABI,
    functionName: 'getUserTotalBalance',
    args: [address || '0x'],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { writeContract: writeApprove, isPending: isApproving } = useWriteContract()
  const { writeContract: writeDeposit, isPending: isDepositing } = useWriteContract()

  const handleDeposit = async () => {
    if (!address || !depositAmount) return

    try {
      // Aprobar primero
      writeApprove({
        address: CONTRACTS.scrollSepolia.stablecoin as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.scrollSepolia.savingsPool as `0x${string}`, parseEther(depositAmount, 6)],
      })

      // Luego depositar
      writeDeposit({
        address: CONTRACTS.scrollSepolia.savingsPool as `0x${string}`,
        abi: SAVINGSPOOL_ABI,
        functionName: 'deposit',
        args: [parseEther(depositAmount, 6)],
      })
    } catch (err) {
      console.error('Deposit error:', err)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Conecta tu Wallet
        </h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ahorros</h1>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <PiggyBank className="w-12 h-12" />
          <div>
            <p className="text-primary-100 text-sm">Balance Total</p>
            <p className="text-3xl font-bold">
              {totalBalance ? formatEther(totalBalance, 6) : '0.00'} USDC
            </p>
          </div>
        </div>
        <p className="text-primary-100 text-sm">Gana intereses del 3% anual</p>
      </div>

      {/* Deposit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Realizar Depósito
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto (USDC)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || isApproving || isDepositing}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {(isApproving || isDepositing) ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Depositar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deposits List */}
      {isLoading ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        </div>
      ) : deposits && (deposits as any[]).length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mis Depósitos</h2>
          {(deposits as any[]).map((deposit: any, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Depósito #{deposit.depositId.toString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Monto: {formatEther(deposit.amount, 6)} USDC
                </p>
                {deposit.isActive && (
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Generando intereses...
                  </p>
                )}
              </div>
              {deposit.isActive && (
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  Retirar
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No tienes depósitos aún</p>
        </div>
      )}
    </div>
  )
}


