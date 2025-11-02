# 🔧 Configuración de .env para Frontend

## 📋 Instrucciones Rápidas

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` y completa:**
   - `VITE_WALLET_CONNECT_PROJECT_ID`: (Opcional) Project ID de WalletConnect
   - Direcciones de contratos: Actualiza después del deployment

3. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## ⚠️ Notas Importantes

- Todas las variables deben empezar con `VITE_` para que Vite las reconozca
- Las direcciones de contratos se obtienen después del deployment
- Reinicia el servidor después de cambiar variables de entorno

## 📝 Ejemplo de Archivo .env

```env
VITE_WALLET_CONNECT_PROJECT_ID=tu_project_id_opcional

# Actualizar después del deployment
VITE_AQUAPAY_CONTRACT=0x...
VITE_BILLING_CONTRACT=0x...
VITE_MICROCREDIT_CONTRACT=0x...
VITE_SAVINGSPOOL_CONTRACT=0x...
VITE_STABLECOIN_CONTRACT=0x...
```

## 🔗 Recursos

- WalletConnect Cloud: https://cloud.walletconnect.com/
- Documentación de Vite: https://vitejs.dev/guide/env-and-mode.html


