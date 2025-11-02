# 📝 Guía de Configuración de Archivos .env

Esta guía te ayudará a configurar correctamente los archivos `.env` necesarios para AquaPay Web3.

## 📁 Archivos .env Necesarios

El proyecto requiere 2 archivos `.env`:

1. `packages/contracts/.env` - Para deployment de contratos
2. `packages/frontend/.env` - Para configuración del frontend

## 🔧 Paso 1: Configurar `packages/contracts/.env`

Este archivo es necesario para desplegar los contratos inteligentes.

### Valores Requeridos:

#### 1. `PRIVATE_KEY` (Requerido)
- **Qué es**: Tu clave privada de la wallet que desplegará los contratos
- **Cómo obtenerla**:
  1. Abre MetaMask
  2. Ve a Settings → Security & Privacy → Show Private Key
  3. Copia la clave privada (sin el prefijo `0x`)
- **Formato**: Solo números y letras, sin espacios, sin `0x` al inicio
- **Ejemplo**: `abc123def456...`
- **⚠️ IMPORTANTE**: 
  - NUNCA compartas esta clave
  - Solo úsala en wallets de prueba con fondos mínimos
  - No la uses en wallets con fondos reales

#### 2. `SCROLL_API_KEY` (Opcional)
- **Qué es**: API Key para verificar contratos en el explorador de Scroll
- **Cómo obtenerla**:
  1. Ve a https://scrollscan.com/
  2. Crea una cuenta
  3. Ve a tu perfil → API Keys
  4. Crea una nueva API Key
- **Cuándo usarla**: Solo si quieres verificar los contratos públicamente
- **Ejemplo**: `ABCD1234EFGH5678`

#### 3. `STABLECOIN_ADDRESS` (Requerido para deployment)
- **Qué es**: Dirección del token stablecoin (USDC o DAI) en Scroll Sepolia
- **Opciones**:
  - **Opción 1**: Usar MockERC20 para testing (recomendado para desarrollo)
    - Deja este campo vacío inicialmente
    - El script de deployment te dará instrucciones para crear un mock token
  - **Opción 2**: Usar USDC real en Scroll Sepolia
    - Busca la dirección oficial en la documentación de Scroll
- **Formato**: Dirección hexadecimal que empieza con `0x`
- **Ejemplo**: `0x1234567890abcdef...`

### Ejemplo de `packages/contracts/.env`:

```env
PRIVATE_KEY=tu_clave_privada_aqui_sin_0x
SCROLL_API_KEY=tu_api_key_opcional
STABLECOIN_ADDRESS=0x...  # o déjalo vacío para usar MockERC20
```

## 🌐 Paso 2: Configurar `packages/frontend/.env`

Este archivo es necesario para que el frontend se conecte con los contratos desplegados.

### Valores Requeridos:

#### 1. `VITE_WALLET_CONNECT_PROJECT_ID` (Opcional pero recomendado)
- **Qué es**: Project ID de WalletConnect para conectar múltiples wallets
- **Cómo obtenerla**:
  1. Ve a https://cloud.walletconnect.com/
  2. Crea una cuenta gratuita
  3. Crea un nuevo proyecto
  4. Copia el Project ID
- **Cuándo usarla**: Si quieres soporte para múltiples wallets además de MetaMask
- **Si no la usas**: Solo funcionará MetaMask directamente

#### 2. Direcciones de Contratos (Requeridas después del deployment)

**⚠️ IMPORTANTE**: Estas direcciones las obtendrás DESPUÉS de desplegar los contratos.

- `VITE_AQUAPAY_CONTRACT`: Dirección del contrato AquaPay
- `VITE_BILLING_CONTRACT`: Dirección del contrato Billing
- `VITE_MICROCREDIT_CONTRACT`: Dirección del contrato MicroCredit
- `VITE_SAVINGSPOOL_CONTRACT`: Dirección del contrato SavingsPool
- `VITE_STABLECOIN_CONTRACT`: Dirección del token stablecoin

### Ejemplo de `packages/frontend/.env`:

```env
VITE_WALLET_CONNECT_PROJECT_ID=tu_project_id_opcional

# Actualizar después del deployment
VITE_AQUAPAY_CONTRACT=0x...
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

## 🚀 Proceso Completo de Configuración

### 1. Pre-deployment (Solo contratos)

```bash
# 1. Crear archivo .env en contracts
cd packages/contracts
cp .env.example .env

# 2. Editar .env y completar:
#    - PRIVATE_KEY (tu clave privada)
#    - STABLECOIN_ADDRESS (o déjalo vacío para mock)
```

### 2. Desplegar Contratos

```bash
# Desde packages/contracts
npm run deploy

# El script mostrará las direcciones desplegadas:
# ✅ SavingsPool deployed to: 0x...
# ✅ AquaPay deployed to: 0x...
# ✅ Billing deployed to: 0x...
# ✅ MicroCredit deployed to: 0x...
```

### 3. Configurar Frontend

```bash
# 1. Crear archivo .env en frontend
cd packages/frontend
cp .env.example .env

# 2. Editar .env y completar con las direcciones del paso 2:
#    - Copia las direcciones que aparecieron en el deployment
#    - Actualiza todas las VITE_*_CONTRACT
```

### 4. Verificar Configuración

```bash
# En frontend
npm run dev

# Verifica que la aplicación cargue sin errores
# Abre http://localhost:3000
```

## ✅ Checklist de Configuración

### Para Contratos:
- [ ] Archivo `.env` creado en `packages/contracts/`
- [ ] `PRIVATE_KEY` configurada (sin `0x`)
- [ ] `STABLECOIN_ADDRESS` configurada o dejada vacía para mock
- [ ] `SCROLL_API_KEY` configurada (opcional)

### Para Frontend:
- [ ] Archivo `.env` creado en `packages/frontend/`
- [ ] `VITE_WALLET_CONNECT_PROJECT_ID` configurado (opcional)
- [ ] Todas las direcciones `VITE_*_CONTRACT` actualizadas después del deployment

## 🔒 Seguridad

### ⚠️ NUNCA:

1. ❌ **Compartas tu PRIVATE_KEY** con nadie
2. ❌ **Subas archivos `.env`** a repositorios públicos (están en `.gitignore`)
3. ❌ **Uses wallets con fondos reales** para desarrollo
4. ❌ **Commits archivos `.env`** al control de versiones

### ✅ SIEMPRE:

1. ✅ **Usa wallets de prueba** para desarrollo
2. ✅ **Mantén archivos `.env` en local** solo
3. ✅ **Usa variables de entorno** en producción
4. ✅ **Revisa `.gitignore`** para asegurar que `.env` esté ignorado

## 🆘 Solución de Problemas

### Error: "Invalid private key"
- **Problema**: La clave privada tiene un formato incorrecto
- **Solución**: Asegúrate de que no tenga el prefijo `0x` y no tenga espacios

### Error: "Insufficient funds"
- **Problema**: No tienes suficiente ETH en Scroll Sepolia
- **Solución**: Obtén ETH de prueba desde un faucet de Scroll

### Error: "Contract not found"
- **Problema**: Las direcciones en `.env` del frontend son incorrectas
- **Solución**: Verifica que las direcciones coincidan con las del deployment

### Las variables no se cargan en el frontend
- **Problema**: Las variables no empiezan con `VITE_`
- **Solución**: Todas las variables del frontend deben empezar con `VITE_`

## 📚 Recursos Adicionales

- [Scroll Sepolia Faucet](https://scroll.io/alpha/faucet)
- [ScrollScan Explorer](https://sepolia.scrollscan.com/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [MetaMask - Exportar Clave Privada](https://support.metamask.io/hc/en-us/articles/360015289632)

---

**💡 Tip**: Guarda las direcciones de contratos en un archivo seguro después del deployment para referencia futura.


