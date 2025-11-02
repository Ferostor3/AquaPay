# 🚀 Instrucciones para Visualizar el Proyecto AquaPay Web3

## Opción 1: Usando el Script (Windows)

1. Doble clic en el archivo `start-frontend.bat`
2. Espera a que aparezca el mensaje con la URL
3. Abre tu navegador en: **http://localhost:3000**

## Opción 2: Manualmente

### 1. Abre una Terminal (PowerShell o CMD)

### 2. Navega al directorio del frontend:

```bash
cd C:\Users\yaret\Downloads\ethM\packages\frontend
```

### 3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

### 4. Abre tu navegador:

Ve a: **http://localhost:3000**

## 🌐 Páginas Disponibles

Una vez que el servidor esté corriendo, podrás acceder a:

- **http://localhost:3000/** - Página de inicio
- **http://localhost:3000/dashboard** - Dashboard de usuario
- **http://localhost:3000/bills** - Facturas
- **http://localhost:3000/payment** - Realizar pagos
- **http://localhost:3000/savings** - Ahorros
- **http://localhost:3000/loans** - Microcréditos
- **http://localhost:3000/admin** - Panel administrativo

## ⚠️ Notas Importantes

1. **Servidor en Segundo Plano**: Si ya ejecutaste `npm run dev`, el servidor debería estar corriendo. Solo abre tu navegador en `http://localhost:3000`.

2. **Cambios en Código**: El servidor de Vite recarga automáticamente cuando haces cambios en el código.

3. **Cerrar el Servidor**: Presiona `Ctrl + C` en la terminal donde está corriendo el servidor.

4. **Puerto Ocupado**: Si el puerto 3000 está ocupado, Vite te sugerirá otro puerto (por ejemplo, 3001). Revisa el mensaje en la terminal.

## 🔧 Si hay Problemas

### El servidor no inicia:
```bash
# Verifica que estés en el directorio correcto
cd C:\Users\yaret\Downloads\ethM\packages\frontend

# Reinstala dependencias si es necesario
npm install

# Inicia el servidor
npm run dev
```

### Error de conexión:
- Verifica que el servidor esté corriendo
- Revisa que el puerto en la terminal coincida con la URL del navegador
- Intenta detener y reiniciar el servidor

## 📱 Conectar Wallet

1. Instala **MetaMask** en tu navegador
2. Crea o importa una cuenta
3. Agrega la red **Scroll Sepolia** a MetaMask:
   - RPC URL: `https://sepolia-rpc.scroll.io/`
   - Chain ID: `534351`
4. Haz clic en "Conectar Wallet" en la aplicación

¡Disfruta explorando AquaPay Web3! 💧


