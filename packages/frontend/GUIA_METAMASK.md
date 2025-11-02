# 🔗 Guía para Conectar MetaMask con AquaPay Web3

## 📋 Prerequisitos

1. **MetaMask Instalado**: Si no lo tienes, descárgalo desde [metamask.io](https://metamask.io/download)
2. **Navegador Compatible**: Chrome, Firefox, Brave, o Edge
3. **Cuenta en MetaMask**: Crea o importa una cuenta en MetaMask

## 🚀 Pasos para Conectar

### 1. Instalar MetaMask (Si no lo tienes)

1. Ve a [metamask.io/download](https://metamask.io/download)
2. Selecciona tu navegador
3. Haz clic en "Instalar MetaMask"
4. Sigue las instrucciones para crear o importar una wallet
5. **Importante**: Guarda tu frase semilla en un lugar seguro

### 2. Agregar Scroll Sepolia a MetaMask

AquaPay Web3 usa la red **Scroll Sepolia Testnet**. Necesitas agregarla a MetaMask:

#### Método 1: Manualmente

1. Abre MetaMask
2. Haz clic en el selector de red (arriba, dice "Ethereum Mainnet" o similar)
3. Haz clic en "Add network" o "Agregar red"
4. Haz clic en "Add a network manually" o "Agregar red manualmente"
5. Completa la información:

   **Información de la Red:**
   - **Network Name**: `Scroll Sepolia`
   - **RPC URL**: `https://sepolia-rpc.scroll.io/`
   - **Chain ID**: `534351`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: `https://sepolia.scrollscan.com/`

6. Haz clic en "Save" o "Guardar"

#### Método 2: Automático (Recomendado)

1. Visita la aplicación AquaPay Web3
2. Cuando hagas clic en "Conectar MetaMask"
3. Si no tienes Scroll Sepolia, verás un botón para agregarla
4. MetaMask se abrirá automáticamente para agregar la red

### 3. Obtener ETH de Prueba (Testnet)

Para interactuar con la aplicación necesitas ETH de prueba:

1. Ve a [Scroll Sepolia Faucet](https://scroll.io/alpha/faucet) (si está disponible)
2. O visita [Sepolia Faucet](https://sepoliafaucet.com/) y luego transfiere a Scroll
3. Ingresa tu dirección de wallet
4. Solicita ETH de prueba
5. Espera unos minutos para recibir el ETH

### 4. Conectar en la Aplicación

1. **Abre la aplicación**: Ve a `http://localhost:3000` (si está corriendo localmente)
2. **Haz clic en "Conectar MetaMask"**: 
   - En la barra superior derecha, o
   - En la página de inicio, o
   - En el dashboard
3. **Acepta la conexión**: MetaMask se abrirá automáticamente
4. **Autoriza la conexión**: Haz clic en "Connect" o "Conectar" en MetaMask
5. **Confirma la red**: Si es necesario, acepta cambiar a Scroll Sepolia

### 5. Verificar Conexión

Una vez conectado, deberías ver:

- ✅ Tu dirección de wallet en la barra superior (ej: `0x742d...bEb`)
- ✅ El nombre de la red: "Scroll Sepolia"
- ✅ Acceso a todas las funcionalidades del dashboard

## 🎯 Funcionalidades Disponibles Después de Conectar

Una vez que tu wallet esté conectada, podrás:

- ✅ **Registrarte** en el sistema con un nombre ENS
- ✅ **Ver facturas** y pagos
- ✅ **Realizar pagos** con stablecoins
- ✅ **Depositar ahorros** y ganar intereses
- ✅ **Solicitar microcréditos** si es necesario
- ✅ **Ver historial** de transacciones

## ⚠️ Solución de Problemas

### MetaMask no se detecta

**Problema**: El botón "Conectar MetaMask" está deshabilitado o no aparece MetaMask como opción.

**Soluciones**:
1. Verifica que MetaMask esté instalado y activo
2. Recarga la página (`Ctrl + R` o `F5`)
3. Cierra y vuelve a abrir el navegador
4. Asegúrate de que MetaMask esté desbloqueado (no bloqueado con contraseña)

### Error: "Red no soportada"

**Problema**: MetaMask te muestra un error de red no soportada.

**Solución**:
1. Agrega Scroll Sepolia a MetaMask (ver paso 2)
2. Cambia manualmente a Scroll Sepolia en MetaMask
3. Intenta conectar nuevamente

### Error: "Usuario rechazó la solicitud"

**Problema**: Hiciste clic en "Rechazar" en MetaMask.

**Solución**:
1. Intenta conectar nuevamente
2. Asegúrate de hacer clic en "Conectar" esta vez

### La aplicación muestra "Red Incorrecta"

**Problema**: Estás conectado a una red diferente (por ejemplo, Ethereum Mainnet).

**Solución**:
1. Verás un botón "Cambiar a Scroll Sepolia" en la aplicación
2. Haz clic en él para cambiar automáticamente
3. O cambia manualmente en MetaMask a Scroll Sepolia

### No tengo ETH para pagar gas fees

**Problema**: No puedes realizar transacciones porque no tienes ETH.

**Solución**:
1. Obtén ETH de prueba desde un faucet de Scroll Sepolia
2. Necesitarás ETH para:
   - Registrar tu usuario
   - Aprobar tokens
   - Realizar pagos
   - Depositar ahorros

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca compartas tu clave privada** con nadie
2. **Verifica siempre** que estés en la URL correcta de la aplicación
3. **Revisa las transacciones** antes de confirmarlas en MetaMask
4. **Usa solo redes de prueba** para desarrollo (Scroll Sepolia, no Mainnet)
5. **Guarda tu frase semilla** en un lugar seguro y nunca la compartas

### Redes de Prueba vs Mainnet

- **Scroll Sepolia (Testnet)**: Red de prueba, ETH gratis desde faucets
- **Scroll Mainnet**: Red real, ETH real, pagos reales
- **Recomendación**: Usa siempre testnet para pruebas y desarrollo

## 📞 Ayuda Adicional

Si tienes problemas:

1. Revisa la consola del navegador (`F12` → Console) para errores
2. Verifica que MetaMask esté actualizado
3. Revisa que la red Scroll Sepolia esté correctamente configurada
4. Asegúrate de tener suficiente ETH para gas fees

---

**¡Disfruta usando AquaPay Web3 con MetaMask! 💧🦊**


