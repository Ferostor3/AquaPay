# 💧 AquaPay Web3 — Sistema de Pagos Descentralizado para el Uso de Agua

## 🌍 Descripción General

AquaPay Web3 es una plataforma de pagos basada en tecnología blockchain (Web3) para gestionar y cobrar el consumo de agua en zonas residenciales o comunitarias, ofreciendo inclusión financiera a personas sin acceso al sistema bancario tradicional.

Permite pagar el servicio de agua con stablecoins, código QR, NFC o WhatsApp, integrando finanzas descentralizadas (DeFi) para ofrecer microcréditos, ahorro comunitario y transparencia total en el uso de recursos.

## 🎯 Objetivo

Construir una infraestructura financiera justa, accesible y transparente que:

- ✅ Permita a los usuarios pagar su servicio de agua de forma digital sin necesidad de banco
- ✅ Genere transparencia en el cobro y uso de fondos gracias a contratos inteligentes
- ✅ Ofrezca microcréditos o ahorros en stablecoins para quienes no pueden pagar a tiempo
- ✅ Sirva como ejemplo de solución empresarial e institucional en México usando Web3

## 📁 Estructura del Proyecto

```
aquapay-web3/
├── packages/
│   ├── contracts/          # Smart Contracts (Solidity)
│   ├── frontend/           # Aplicación React + Web3
│   └── backend/            # API y servicios (opcional)
├── docs/                   # Documentación
└── README.md
```

contrato: 0x8615F0e48dd21781B6052a5f23601a21F7687422

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ y npm/yarn
- MetaMask o Wallet Connect
- Cuenta en Scroll Sepolia Testnet (con ETH para gas)
- Project ID de WalletConnect (opcional, para WalletConnect)

### Instalación

```bash
# Instalar dependencias del workspace
npm install

# Instalar dependencias de los packages
cd packages/contracts && npm install
cd ../frontend && npm install
cd ../..
```

### Configuración

#### 1. Contratos (packages/contracts)

Crea un archivo `.env` en `packages/contracts/`:

```env
PRIVATE_KEY=tu_clave_privada_aqui
SCROLL_API_KEY=tu_api_key_de_scrollscan (opcional)
STABLECOIN_ADDRESS=0x...  # Dirección de USDC en Scroll Sepolia
```

#### 2. Frontend (packages/frontend)

Crea un archivo `.env` en `packages/frontend/`:

```env
VITE_WALLET_CONNECT_PROJECT_ID=tu_project_id (opcional)
VITE_AQUAPAY_CONTRACT=0x...  # Actualizar después del deployment
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

### Desarrollo

```bash
# Compilar contratos
cd packages/contracts
npm run compile

# Desplegar contratos en Scroll Sepolia Testnet
npm run deploy

# Iniciar frontend en desarrollo
cd ../frontend
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

## ⚙️ Tecnología Utilizada

| Tecnología | Uso Principal |
|------------|---------------|
| Ethereum / Scroll (zkEVM) | Procesamiento rápido y barato de pagos |
| Arbitrum Stylus | Optimización de contratos inteligentes complejos |
| ENS (Ethereum Name Service) | Identidad digital: "casa123.aguapay.eth" |
| Stablecoins (USDC, DAI) | Pagos estables sin volatilidad |
| WhatsApp / QR / NFC | Métodos sencillos de pago |
| IPFS | Almacenamiento de facturas y comprobantes de pago |

## 🔐 Funcionalidades Principales

### 1. Sistema de Pagos Web3
- Subdominio ENS por hogar (ej: `casa123.aguapay.eth`)
- Pago con código QR desde app o WhatsApp
- Pago con stablecoin (USDC/DAI) en Scroll
- Pago con pesos mexicanos vía pasarela

### 2. Contrato Inteligente de Facturación
- Registro de consumo y pagos en blockchain
- Transparencia total en montos y fechas
- Pagos automáticos mensuales o semanales

### 3. Microcréditos y Ahorro (DeFi)
- Microcréditos automáticos respaldados por fondo comunitario
- Ahorro en stablecoins con intereses
- Préstamos sin necesidad de banco tradicional

### 4. Transparencia Institucional
- Verificación de pagos en tiempo real
- Prevención de corrupción
- Generación de confianza comunitaria

## 🏗️ Arquitectura

### Smart Contracts
- `AquaPay.sol`: Contrato principal de pagos
- `Billing.sol`: Sistema de facturación
- `MicroCredit.sol`: Gestión de microcréditos
- `SavingsPool.sol`: Fondo de ahorro comunitario

### Frontend
- React + TypeScript
- Wagmi / Viem para conexión Web3
- Wallet Connect para múltiples wallets
- Integración con ENS
- QR Code generator/reader
- IPFS para facturas

## 📚 Documentación Adicional

- **[Guía de Deployment](./docs/DEPLOYMENT.md)**: Instrucciones detalladas para desplegar el sistema
- **[Arquitectura del Sistema](./docs/ARCHITECTURE.md)**: Descripción técnica de la arquitectura
- **[Guía de Usuario](./docs/USER_GUIDE.md)**: Manual de usuario completo
- **[Documentación de Contratos](./docs/CONTRACTS.md)**: Referencia técnica de los smart contracts

## 🧪 Testing

```bash
# Ejecutar tests de contratos
cd packages/contracts
npm run test
```

## 📝 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto y Soporte

Para preguntas o soporte, consulta la documentación en `/docs` o abre un issue en el repositorio.

---

**💧 AquaPay Web3: Democratizando el acceso al agua con finanzas abiertas, pagos justos y tecnología blockchain.**

