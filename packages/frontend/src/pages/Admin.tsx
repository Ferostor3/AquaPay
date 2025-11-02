import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS, BILLING_ABI, AQUAPAY_ABI } from '../config/contracts'
import { formatEther } from '../lib/utils'
import { Settings, FileText, Users, DollarSign, AlertCircle, Download } from 'lucide-react'
import CreateBillModal from '../components/admin/CreateBillModal'
import AllBillsView from '../components/admin/AllBillsView'
import PriceConfigModal from '../components/admin/PriceConfigModal'

export default function Admin() {
  const { address, isConnected } = useAccount()
  const [activeView, setActiveView] = useState<'main' | 'allBills'>('main')
  const [showCreateBill, setShowCreateBill] = useState(false)
  const [showPriceConfig, setShowPriceConfig] = useState(false)

  // Verificar si el usuario es admin (en producción, usar AccessControl del contrato)
  const isAdmin = true // En producción, verificar con el contrato

  // Obtener estadísticas
  const { data: totalUsers } = useReadContract({
    address: CONTRACTS.scrollSepolia.aquaPay as `0x${string}`,
    abi: AQUAPAY_ABI,
    functionName: 'totalUsers',
  })

  const { data: totalRevenue } = useReadContract({
    address: CONTRACTS.scrollSepolia.aquaPay as `0x${string}`,
    abi: AQUAPAY_ABI,
    functionName: 'totalRevenue',
  })

  const { data: totalUnpaid } = useReadContract({
    address: CONTRACTS.scrollSepolia.billing as `0x${string}`,
    abi: BILLING_ABI,
    functionName: 'totalUnpaidBills',
  })

  const handleExportReports = () => {
    // Función para exportar reportes
    const reportData = {
      totalUsers: totalUsers?.toString() || '0',
      totalRevenue: totalRevenue ? formatEther(totalRevenue, 6) : '0',
      totalUnpaid: totalUnpaid?.toString() || '0',
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aquapay-report-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
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

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos de administrador
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel Administrativo</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <Users className="w-8 h-8 text-primary-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Usuarios</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalUsers ? totalUsers.toString() : '-'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <FileText className="w-8 h-8 text-primary-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Facturas Pendientes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalUnpaid ? totalUnpaid.toString() : '-'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <DollarSign className="w-8 h-8 text-primary-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ingresos Totales</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalRevenue ? formatEther(totalRevenue, 6) : '-'} USDC
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <Settings className="w-8 h-8 text-primary-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">Activo</p>
        </div>
      </div>

      {activeView === 'main' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Funciones Administrativas
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowCreateBill(true)}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-left flex items-center justify-between"
            >
              <span>Crear Nueva Factura</span>
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('allBills')}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-left flex items-center justify-between"
            >
              <span>Ver Todas las Facturas</span>
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowPriceConfig(true)}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-left flex items-center justify-between"
            >
              <span>Configurar Precios</span>
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleExportReports}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-left flex items-center justify-between"
            >
              <span>Exportar Reportes</span>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {activeView === 'allBills' && (
        <div>
          <button
            onClick={() => setActiveView('main')}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Volver
          </button>
          <AllBillsView />
        </div>
      )}

      {/* Modales */}
      <CreateBillModal isOpen={showCreateBill} onClose={() => setShowCreateBill(false)} />
      <PriceConfigModal isOpen={showPriceConfig} onClose={() => setShowPriceConfig(false)} />
    </div>
  )
}

