# 📖 Guía de Usuario - AquaPay Web3

## 🎯 Introducción

Bienvenido a AquaPay Web3, el sistema de pagos descentralizado para el uso de agua. Esta guía te ayudará a usar la plataforma paso a paso.

## 🚀 Inicio Rápido

### 1. Conectar Wallet

1. Visita la aplicación web de AquaPay Web3
2. Haz clic en "Conectar Wallet" en la esquina superior derecha
3. Selecciona tu wallet (MetaMask, WalletConnect, etc.)
4. Acepta la conexión en tu wallet
5. Asegúrate de estar conectado a **Scroll Sepolia Testnet**

### 2. Agregar Red Scroll Sepolia

Si no tienes Scroll Sepolia en tu MetaMask:

**Información de Red:**
- **Nombre:** Scroll Sepolia
- **RPC URL:** https://sepolia-rpc.scroll.io/
- **Chain ID:** 534351
- **Símbolo:** ETH
- **Explorer:** https://sepolia.scrollscan.com/

## 👤 Registro de Usuario

### Paso 1: Obtener ENS Name

1. Ve a tu dashboard
2. Si no estás registrado, verás un mensaje
3. Proporciona tu nombre ENS deseado (ej: `casa123.aguapay.eth`)
4. Proporciona el ID de tu medidor de agua
5. Confirma la transacción en tu wallet

**Nota:** El registro requiere una pequeña cantidad de ETH para gas fees.

### Paso 2: Verificar Registro

Una vez registrado, verás:
- Tu nombre ENS
- ID de medidor
- Estado de cuenta (Activo/Inactivo)

## 💰 Realizar un Pago

### Opción 1: Pago con Stablecoin

1. Ve a "Realizar Pago" o haz clic en una factura pendiente
2. Selecciona "Stablecoin" como método de pago
3. Ingresa el monto a pagar (en USDC)
4. Verifica tu balance disponible
5. Haz clic en "Pagar con Stablecoin"
6. Aprueba la transacción en tu wallet (dos pasos):
   - Primero aprueba el gasto del token
   - Luego confirma el pago
7. Espera la confirmación de la transacción

### Opción 2: Pago con QR

1. Ve a "Realizar Pago"
2. Selecciona "QR" como método de pago
3. Ingresa el monto
4. Haz clic en "Generar Código QR"
5. Escanea el código QR con tu app de pago
6. Completa el pago desde tu app

### Opción 3: Pago vía WhatsApp

1. Ve a "Realizar Pago"
2. Selecciona "WhatsApp" como método de pago
3. Haz clic en "Abrir WhatsApp"
4. Se abrirá WhatsApp con un mensaje pre-rellenado
5. Envía el mensaje para procesar el pago

## 📄 Ver Facturas

1. Ve a "Facturas" en el menú
2. Verás todas tus facturas:
   - **Verde (Pagada):** Factura pagada
   - **Amarillo (Pendiente):** Factura pendiente de pago
   - **Rojo (Vencida):** Factura vencida
3. Haz clic en "Pagar Ahora" para pagar una factura pendiente
4. Ver detalles:
   - Consumo de agua (litros)
   - Monto a pagar
   - Fecha de vencimiento
   - Estado de pago

## 🐷 Ahorros

### Realizar un Depósito

1. Ve a "Ahorros" en el menú
2. Verás tu balance total actual
3. Ingresa el monto que deseas depositar
4. Haz clic en "Depositar"
5. Aprueba la transacción en tu wallet
6. Tu depósito comenzará a generar intereses (3% anual)

### Ver Mis Depósitos

1. En la página de "Ahorros"
2. Verás todos tus depósitos activos
3. Cada depósito muestra:
   - Monto depositado
   - Intereses acumulados
   - Estado (Activo/Retirado)

### Retirar Depósito

1. En la página de "Ahorros"
2. Localiza el depósito que deseas retirar
3. Haz clic en "Retirar"
4. Confirmarás la transacción
5. Recibirás el monto depositado más los intereses acumulados

## 💳 Microcréditos

### Solicitar un Préstamo

1. Ve a "Préstamos" en el menú
2. Haz clic en "Solicitar Préstamo"
3. Completa el formulario:
   - **Monto:** Cantidad que necesitas (mínimo 0.1 USDC, máximo según límite)
   - **Plazo:** Días para pagar (máximo 365 días)
   - **Propósito:** Razón del préstamo
4. Haz clic en "Solicitar Préstamo"
5. Confirma la transacción
6. Los fondos se transferirán inmediatamente a tu wallet

### Ver Mis Préstamos

1. En la página de "Préstamos"
2. Verás todos tus préstamos:
   - **Activo:** Préstamo vigente
   - **Pagado:** Préstamo completamente pagado
   - **Cerrado:** Préstamo cerrado

### Pagar un Préstamo

1. Localiza el préstamo activo
2. Haz clic en "Pagar Préstamo"
3. Ingresa el monto a pagar (puede ser parcial)
4. Confirma la transacción
5. El pago se aplicará primero a intereses, luego a principal

## 📊 Dashboard

El dashboard muestra:

- **Información del Usuario:**
  - Nombre ENS
  - ID de medidor
  - Estado de cuenta

- **Acciones Rápidas:**
  - Realizar Pago
  - Ver Facturas
  - Ahorros

- **Resumen Financiero:**
  - Balance de stablecoins
  - Ahorros totales
  - Préstamos activos

## ⚠️ Solución de Problemas

### "Insufficient balance"
**Problema:** No tienes suficientes stablecoins para realizar la operación.

**Solución:**
- Obtén USDC o DAI en Scroll Sepolia Testnet
- Puedes usar un faucet para obtener tokens de prueba

### "User not registered"
**Problema:** Intentas usar funciones pero no estás registrado.

**Solución:**
- Ve a tu dashboard y regístrate primero
- Proporciona tu ENS name y ID de medidor

### "Transaction failed"
**Problema:** La transacción falló.

**Soluciones:**
- Verifica que tengas suficiente ETH para gas fees
- Verifica que estés en la red correcta (Scroll Sepolia)
- Aumenta el gas limit si es necesario
- Revisa el mensaje de error en el explorer

### "Network not supported"
**Problema:** Tu wallet no está conectada a Scroll Sepolia.

**Solución:**
- Agrega Scroll Sepolia a tu MetaMask
- Cambia la red en tu wallet a Scroll Sepolia
- Verifica la configuración de red

## 🔐 Seguridad

### Buenas Prácticas

1. **Nunca compartas tu clave privada** con nadie
2. **Verifica siempre las direcciones** de contratos antes de interactuar
3. **Revisa las transacciones** antes de confirmar
4. **Usa hardware wallets** para grandes cantidades
5. **Mantén tu software actualizado**

### Protección de Datos

- Todos los pagos quedan registrados en la blockchain (transparente e inmutable)
- Tus datos personales no se almacenan on-chain
- Las facturas se almacenan en IPFS (descentralizado)

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa esta guía primero
2. Consulta la documentación técnica en `/docs`
3. Revisa los eventos en el blockchain explorer
4. Contacta al soporte del proyecto

## 🎓 Conceptos Importantes

### Gas Fees
Costo en ETH para ejecutar transacciones en la blockchain. En Scroll, los gas fees son muy bajos.

### Stablecoins
Tokens que mantienen un valor estable (USDC, DAI). 1 USDC ≈ 1 USD.

### ENS Names
Nombres legibles para direcciones de wallet. Ejemplo: `casa123.aguapay.eth` en lugar de `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

### IPFS
Sistema de almacenamiento descentralizado para archivos y documentos.

---

**¡Disfruta usando AquaPay Web3! 💧**


