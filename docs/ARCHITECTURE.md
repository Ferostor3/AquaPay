# 🏗️ Arquitectura del Sistema - AquaPay Web3

## Visión General

AquaPay Web3 es un sistema descentralizado de pagos para el uso de agua construido sobre la blockchain de Scroll (zkEVM). El sistema consta de varios contratos inteligentes que trabajan en conjunto para proporcionar pagos, facturación, microcréditos y ahorro comunitario.

## 📐 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  - Dashboard de Usuario                                  │
│  - Panel Administrativo                                  │
│  - Sistema de Pagos (QR, WhatsApp, Stablecoins)          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Wagmi/Viem (Web3 Integration)               │
│  - Conexión de Wallets                                  │
│  - Interacción con Contratos                            │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Scroll Blockchain (zkEVM)               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            AquaPay (Contrato Principal)          │   │
│  │  - Registro de usuarios                          │   │
│  │  - Procesamiento de pagos                        │   │
│  │  - Integración con otros contratos                │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│         ┌───────────────┼───────────────┐                │
│         │               │               │                │
│         ▼               ▼               ▼                │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ Billing  │   │ MicroCredit│ │SavingsPool│            │
│  │          │   │           │   │          │            │
│  │Facturación│   │Préstamos │   │ Ahorros  │            │
│  └──────────┘   └──────────┘   └──────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Contratos Inteligentes

### 1. AquaPay (Contrato Principal)

**Responsabilidades:**
- Registro de usuarios con ENS names
- Procesamiento de pagos con stablecoins
- Integración con contratos auxiliares
- Almacenamiento de historial de pagos

**Funciones Principales:**
- `registerUser()`: Registra un nuevo usuario
- `payWithStablecoin()`: Procesa pago con stablecoin
- `registerFiatPayment()`: Registra pago en fiat (solo admin)

**Eventos:**
- `UserRegistered`: Usuario registrado
- `PaymentReceived`: Pago recibido

### 2. Billing (Facturación)

**Responsabilidades:**
- Creación de facturas
- Gestión de consumo de agua
- Seguimiento de pagos pendientes
- Cálculo de montos

**Funciones Principales:**
- `createBill()`: Crea una nueva factura
- `getUnpaidBills()`: Obtiene facturas pendientes
- `getOverdueBills()`: Obtiene facturas vencidas
- `markBillAsPaid()`: Marca factura como pagada

**Eventos:**
- `BillCreated`: Factura creada
- `BillPaid`: Factura pagada

### 3. MicroCredit (Microcréditos)

**Responsabilidades:**
- Gestión de préstamos comunitarios
- Cálculo de intereses
- Seguimiento de pagos de préstamos
- Integración con fondo comunitario

**Funciones Principales:**
- `requestLoan()`: Solicita un préstamo
- `repayLoan()`: Paga un préstamo
- `calculateTotalOwed()`: Calcula deuda total

**Eventos:**
- `LoanCreated`: Préstamo creado
- `LoanRepaid`: Préstamo pagado

### 4. SavingsPool (Fondo de Ahorro)

**Responsabilidades:**
- Depósitos de ahorro de usuarios
- Cálculo de intereses acumulados
- Gestión de reserva para préstamos
- Retiros de depósitos

**Funciones Principales:**
- `deposit()`: Realiza un depósito
- `withdraw()`: Retira depósito con intereses
- `calculateInterest()`: Calcula intereses acumulados
- `getAvailableForLoans()`: Obtiene monto disponible para préstamos

**Eventos:**
- `DepositCreated`: Depósito creado
- `Withdrawal`: Retiro realizado

## 🔄 Flujos Principales

### Flujo de Pago

1. Usuario escanea QR o accede a la página de pago
2. Frontend obtiene información de la factura desde Billing
3. Usuario aprueba gasto de stablecoin y confirma pago
4. Frontend llama a `payWithStablecoin()` en AquaPay
5. AquaPay transfiere tokens y marca factura como pagada en Billing
6. Se emite evento `PaymentReceived`
7. Frontend actualiza UI con confirmación

### Flujo de Facturación

1. Admin (o sistema automatizado) crea factura llamando a `createBill()` en Billing
2. Se emite evento `BillCreated`
3. Usuario ve factura en su dashboard
4. Usuario puede pagar inmediatamente o solicitar préstamo si no tiene fondos

### Flujo de Microcrédito

1. Usuario solicita préstamo llamando a `requestLoan()` en MicroCredit
2. Contrato verifica fondos disponibles en SavingsPool
3. Se transfiere monto desde SavingsPool al usuario
4. Se emite evento `LoanCreated`
5. Usuario puede pagar préstamo con intereses usando `repayLoan()`

### Flujo de Ahorro

1. Usuario deposita stablecoins llamando a `deposit()` en SavingsPool
2. Depósito queda activo y genera intereses diariamente
3. Usuario puede retirar en cualquier momento llamando a `withdraw()`
4. Se calculan intereses acumulados y se transfieren tokens

## 🔗 Integración con Servicios Externos

### ENS (Ethereum Name Service)
- Cada usuario recibe un subdominio ENS (ej: `casa123.aguapay.eth`)
- Permite identidad digital única sin necesidad de recordar direcciones hexadecimales

### IPFS (InterPlanetary File System)
- Almacenamiento de facturas y comprobantes
- Hash IPFS almacenado en contratos para referenciar documentos

### WhatsApp Integration
- Pago vía mensaje de WhatsApp
- Generación de código QR para pago rápido

### QR Code
- Generación de QR codes para pagos
- Escaneo desde app móvil

## 🔒 Seguridad

### Medidas Implementadas

1. **ReentrancyGuard**: Protección contra ataques de reentrancia
2. **AccessControl**: Control de acceso para funciones administrativas
3. **Ownable**: Propiedad de contratos solo para owner
4. **Validaciones**: Verificación de inputs y estados antes de ejecutar funciones
5. **Events**: Registro de todas las transacciones importantes

### Roles y Permisos

- **Owner**: Control total del contrato
- **Biller**: Puede crear facturas
- **Usuario**: Puede pagar, ahorrar y solicitar préstamos

## 📊 Almacenamiento de Datos

### On-Chain
- Información de usuarios
- Facturas y pagos
- Préstamos y ahorros
- Estados y balances

### Off-Chain (IPFS)
- Comprobantes de pago
- Facturas detalladas
- Documentos adicionales

## 🚀 Escalabilidad

### Optimizaciones

1. **Batch Operations**: Múltiples operaciones en una transacción
2. **Events**: Uso eficiente de eventos para indexación off-chain
3. **View Functions**: Lectura de datos sin costo de gas
4. **Scroll zkEVM**: Reducir costos de gas significativamente

### Futuras Mejoras

- Integración con Arbitrum Stylus para contratos más complejos
- Implementación de Layer 2 para microtransacciones
- Indexación off-chain para búsquedas rápidas


