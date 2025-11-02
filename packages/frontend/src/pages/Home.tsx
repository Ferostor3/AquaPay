import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Droplet, Zap, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react'
import WalletConnect from '../components/WalletConnect'

export default function Home() {
  const { isConnected } = useAccount()

  const features = [
    {
      icon: Zap,
      title: 'Pagos Rápidos',
      description: 'Paga tu servicio de agua con stablecoins, QR o WhatsApp en segundos',
    },
    {
      icon: Shield,
      title: 'Transparente',
      description: 'Todas las transacciones quedan registradas en la blockchain',
    },
    {
      icon: Globe,
      title: 'Inclusión Financiera',
      description: 'Accede a servicios financieros sin necesidad de banco tradicional',
    },
  ]

  const benefits = [
    'Sin necesidad de cuenta bancaria',
    'Microcréditos automáticos disponibles',
    'Ahorro con intereses en stablecoins',
    'Transparencia total en el uso de recursos',
    'Pagos con QR, NFC o WhatsApp',
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Droplet className="w-20 h-20 text-primary-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          AquaPay <span className="text-primary-500">Web3</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sistema de Pagos Descentralizado para el Uso de Agua
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Democratizando el acceso al agua con finanzas abiertas, pagos justos y tecnología blockchain.
          Permite pagar el servicio de agua sin necesidad de banco tradicional.
        </p>

        <div className="flex justify-center space-x-4 pt-4">
          {isConnected ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium flex items-center space-x-2"
            >
              <span>Ir al Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium flex items-center space-x-2"
            >
              <span>Conectar Wallet</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Icon className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          )
        })}
      </section>

      {/* Benefits */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          ¿Por qué AquaPay Web3?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
              <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-lg mb-6 opacity-90">
          Conecta tu wallet y comienza a pagar tu servicio de agua de forma descentralizada
        </p>
        <div className="max-w-md mx-auto">
          <WalletConnect />
        </div>
      </section>
    </div>
  )
}

