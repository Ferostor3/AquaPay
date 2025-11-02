# 🚀 Configuración de Archivos .env - Paso a Paso

## 📋 Resumen

Necesitas crear 2 archivos `.env`:
1. `packages/contracts/.env` - Para deployment de contratos
2. `packages/frontend/.env` - Para configuración del frontend

## 🔧 Paso 1: Configurar `packages/contracts/.env`

### Opción A: Crear manualmente

1. **Crea el archivo** en `packages/contracts/.env`
2. **Copia y pega este contenido:**

```env
PRIVATE_KEY=tu_clave_privada_aqui_sin_0x
SCROLL_API_KEY=tu_api_key_opcional
STABLECOIN_ADDRESS=
```

3. **Completa los valores:**

   **PRIVATE_KEY** (Requerido):
   - Abre MetaMask
   - Settings → Security & Privacy → Show Private Key
   - Copia la clave (sin el prefijo `0x`)
   - Pégala en el archivo .env
   
   **SCROLL_API_KEY** (Opcional):
   - Ve a https://scrollscan.com/
   - Crea cuenta y obtén API Key
   - O déjalo vacío si no quieres verificar contratos
   
   **STABLECOIN_ADDRESS**:
   - Déjalo vacío inicialmente (usaremos MockERC20 para testing)
   - O usa la dirección real de USDC en Scroll Sepolia

### Opción B: Copiar desde ejemplo

```bash
cd packages/contracts
copy .env.example .env
# Luego edita .env y completa los valores
```

## 🌐 Paso 2: Configurar `packages/frontend/.env`

### Opción A: Crear manualmente

1. **Crea el archivo** en `packages/frontend/.env`
2. **Copia y pega este contenido:**

```env
VITE_WALLET_CONNECT_PROJECT_ID=

VITE_AQUAPAY_CONTRACT=0x...
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

3. **Completa los valores:**

   **VITE_WALLET_CONNECT_PROJECT_ID** (Opcional):
   - Ve a https://cloud.walletconnect.com/
   - Crea cuenta gratuita
   - Crea proyecto y copia Project ID
   - O déjalo vacío (solo funcionará MetaMask)
   
   **Direcciones de Contratos** (Después del deployment):
   - Estas direcciones las obtendrás DESPUÉS de desplegar los contratos
   - Por ahora, déjalas como `0x...`
   - Después del deployment, actualiza con las direcciones reales

### Opción B: Copiar desde ejemplo

```bash
cd packages/frontend
copy .env.example .env
# Luego edita .env y completa los valores
```

## 📝 Ejemplo Completo de Archivos .env

### `packages/contracts/.env`:

```env
PRIVATE_KEY=abc123def456789012345678901234567890123456789012345678901234567890
SCROLL_API_KEY=
STABLECOIN_ADDRESS=
```

### `packages/frontend/.env`:

```env
VITE_WALLET_CONNECT_PROJECT_ID=

VITE_AQUAPAY_CONTRACT=0x...
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

## 🎯 Orden de Configuración

### 1. Primero: Configurar Contratos

```bash
# 1. Crea packages/contracts/.env
# 2. Completa PRIVATE_KEY (mínimo)
# 3. Deja STABLECOIN_ADDRESS vacío (para mock)
```

### 2. Segundo: Desplegar Contratos

```bash
cd packages/contracts
npm run deploy

# El script mostrará las direcciones:
# ✅ SavingsPool deployed to: 0x1234...
# ✅ AquaPay deployed to: 0x5678...
# ✅ Billing deployed to: 0x9abc...
# ✅ MicroCredit deployed to: 0xdef0...
```

### 3. Tercero: Configurar Frontend

```bash
# 1. Crea packages/frontend/.env
# 2. Copia las direcciones del paso 2
# 3. Actualiza todas las VITE_*_CONTRACT
```

## ⚠️ Advertencias Importantes

### 🔒 Seguridad

1. **NUNCA compartas tu PRIVATE_KEY** con nadie
2. **NUNCA subas archivos `.env`** a repositorios públicos
3. **Solo usa wallets de prueba** para desarrollo
4. **Verifica que `.env` esté en `.gitignore`**

### ✅ Formato Correcto

- **PRIVATE_KEY**: Sin `0x`, sin espacios, 64 caracteres
- **Direcciones**: Deben empezar con `0x` y tener 42 caracteres
- **Variables del frontend**: Deben empezar con `VITE_`

## 🆘 Solución de Problemas

### "Invalid private key"
- Verifica que no tenga `0x` al inicio
- Verifica que no tenga espacios
- Debe tener exactamente 64 caracteres

### "Contract not found"
- Asegúrate de haber desplegado los contratos primero
- Verifica que las direcciones en frontend/.env sean correctas
- Copia las direcciones exactamente del deployment

### Variables no se cargan en frontend
- Todas las variables deben empezar con `VITE_`
- Reinicia el servidor después de cambiar `.env`
- Verifica que el archivo se llame exactamente `.env` (no `.env.local`)

## 📚 Recursos

- **Scroll Sepolia Faucet**: https://scroll.io/alpha/faucet
- **ScrollScan**: https://sepolia.scrollscan.com/
- **WalletConnect**: https://cloud.walletconnect.com/

---

**💡 Tip**: Después del deployment, guarda las direcciones en un archivo seguro para referencia futura.


