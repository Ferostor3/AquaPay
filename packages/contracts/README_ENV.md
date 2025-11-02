# 🔧 Configuración de .env para Contratos

## 📋 Instrucciones Rápidas

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` y completa:**
   - `PRIVATE_KEY`: Tu clave privada (sin `0x`)
   - `STABLECOIN_ADDRESS`: Dirección del token o déjalo vacío para mock
   - `SCROLL_API_KEY`: (Opcional) Para verificar contratos

3. **Despliega los contratos:**
   ```bash
   npm run deploy
   ```

## ⚠️ Advertencias de Seguridad

- **NUNCA** compartas tu clave privada
- **NUNCA** subas el archivo `.env` a repositorios públicos
- **Solo usa** wallets de prueba para desarrollo
- El archivo `.env` está en `.gitignore` y no debería ser committeado

## 📝 Ejemplo de Archivo .env

```env
PRIVATE_KEY=abc123def456789...
SCROLL_API_KEY=tu_api_key_opcional
STABLECOIN_ADDRESS=0x...  # o déjalo vacío
```

## 🔗 Recursos

- Obtén ETH de prueba: https://scroll.io/alpha/faucet
- ScrollScan: https://sepolia.scrollscan.com/


