# 🚀 Guía de Deployment - AquaPay Web3

## Prerequisitos

1. **Node.js** 18+ y npm/yarn
2. **Wallet** con fondos en Scroll Sepolia Testnet
3. **Clave privada** de la wallet para deployment
4. **Project ID** de WalletConnect (para frontend)

## 📦 Instalación

```bash
# Instalar dependencias del proyecto
npm install

# Instalar dependencias de los packages
npm install --workspace=contracts
npm install --workspace=frontend
```

## 🔧 Configuración

### 1. Contratos (packages/contracts)

Crea un archivo `.env` en `packages/contracts/`:

```env
PRIVATE_KEY=tu_clave_privada_aqui
SCROLL_API_KEY=tu_api_key_de_scrollscan
STABLECOIN_ADDRESS=0x...  # Dirección de USDC en Scroll Sepolia
```

### 2. Frontend (packages/frontend)

Crea un archivo `.env` en `packages/frontend/`:

```env
VITE_WALLET_CONNECT_PROJECT_ID=tu_project_id
VITE_AQUAPAY_CONTRACT=0x...
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

## 🏗️ Deployment de Contratos

### 1. Compilar contratos

```bash
cd packages/contracts
npm run compile
```

### 2. Ejecutar tests (opcional)

```bash
npm run test
```

### 3. Desplegar contratos en Scroll Sepolia

```bash
npm run deploy
```

El script de deployment:
- Desplegará todos los contratos en orden
- Configurará las interconexiones entre contratos
- Mostrará las direcciones desplegadas

**Importante:** Guarda las direcciones de los contratos para configurar el frontend.

### 4. Verificar contratos (opcional)

```bash
npm run verify
```

## 🌐 Deployment del Frontend

### 1. Desarrollo local

```bash
cd packages/frontend
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

### 2. Build para producción

```bash
npm run build
```

Los archivos estarán en `dist/`.

### 3. Deploy en producción

Puedes desplegar en Vercel, Netlify, o cualquier hosting estático:

```bash
# Vercel
npm install -g vercel
vercel

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Checklist de Deployment

- [ ] Contratos compilados sin errores
- [ ] Tests pasando
- [ ] Contratos desplegados en Scroll Sepolia
- [ ] Direcciones de contratos guardadas
- [ ] Variables de entorno configuradas en frontend
- [ ] Frontend compilado correctamente
- [ ] Frontend desplegado en hosting
- [ ] WalletConnect configurado
- [ ] Conexión a red correcta verificada

## 🔗 Redes Disponibles

### Scroll Sepolia (Testnet)
- Chain ID: 534351
- RPC: https://sepolia-rpc.scroll.io/
- Explorer: https://sepolia.scrollscan.com/

### Scroll Mainnet
- Chain ID: 534352
- RPC: https://rpc.scroll.io/
- Explorer: https://scrollscan.com/

## ⚠️ Notas Importantes

1. **Seguridad:** Nunca expongas tu clave privada públicamente
2. **Testnet:** Usa siempre testnet para desarrollo y testing
3. **Verificación:** Verifica los contratos en el explorer para transparencia
4. **Gas:** Asegúrate de tener suficiente ETH en Scroll Sepolia para gas fees

## 🆘 Troubleshooting

### Error: "Insufficient funds"
- Verifica que tu wallet tenga ETH en Scroll Sepolia

### Error: "Network not supported"
- Agrega Scroll Sepolia a MetaMask:
  - Chain ID: 534351
  - RPC: https://sepolia-rpc.scroll.io/

### Error: "Contract not found"
- Verifica que las direcciones de contratos en `.env` sean correctas
- Asegúrate de que los contratos estén desplegados


