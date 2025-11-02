# 📜 Documentación de Contratos - AquaPay Web3

## Contratos Desplegados

### AquaPay.sol

**Dirección:** `0x...` (actualizar después del deployment)

**Propósito:** Contrato principal del sistema que gestiona usuarios y pagos.

#### Funciones Principales

##### `registerUser(string memory ensName, uint256 waterMeterId)`
Registra un nuevo usuario en el sistema.
- **Parámetros:**
  - `ensName`: Nombre ENS del usuario (ej: "casa123.aguapay.eth")
  - `waterMeterId`: ID único del medidor de agua
- **Emite:** `UserRegistered`

##### `payWithStablecoin(uint256 amount, uint256 billId, string memory ipfsHash)`
Procesa un pago con stablecoin.
- **Parámetros:**
  - `amount`: Monto a pagar (en unidades del token)
  - `billId`: ID de la factura asociada
  - `ipfsHash`: Hash IPFS del comprobante
- **Requiere:** Aprobación previa del token
- **Emite:** `PaymentReceived`

##### `getUserInfo(address user)`
Obtiene información de un usuario.
- **Retorna:** Struct con información del usuario

##### `getUserPayments(address user)`
Obtiene todos los pagos de un usuario.
- **Retorna:** Array de pagos

### Billing.sol

**Dirección:** `0x...` (actualizar después del deployment)

**Propósito:** Sistema de facturación y gestión de consumo de agua.

#### Funciones Principales

##### `createBill(address user, uint256 consumption, uint256 dueDate, string memory ipfsHash, string memory metadata)`
Crea una nueva factura.
- **Parámetros:**
  - `user`: Dirección del usuario
  - `consumption`: Litros de agua consumidos
  - `dueDate`: Fecha de vencimiento (timestamp)
  - `ipfsHash`: Hash IPFS de la factura
  - `metadata`: JSON string con metadata adicional
- **Retorna:** ID de la factura creada
- **Requiere:** Rol BILLER
- **Emite:** `BillCreated`

##### `getBill(uint256 billId)`
Obtiene una factura por ID.

##### `getUserBills(address user)`
Obtiene todas las facturas de un usuario.

##### `getUnpaidBills(address user)`
Obtiene las facturas pendientes de un usuario.

##### `getOverdueBills(address user)`
Obtiene las facturas vencidas de un usuario.

### MicroCredit.sol

**Dirección:** `0x...` (actualizar después del deployment)

**Propósito:** Sistema de microcréditos comunitarios.

#### Funciones Principales

##### `requestLoan(uint256 amount, uint256 term, string memory purpose)`
Solicita un microcrédito.
- **Parámetros:**
  - `amount`: Monto solicitado
  - `term`: Duración del préstamo en días
  - `purpose`: Propósito del préstamo
- **Retorna:** ID del préstamo creado
- **Emite:** `LoanCreated`

##### `repayLoan(uint256 loanId, uint256 amount)`
Paga un préstamo (total o parcial).
- **Parámetros:**
  - `loanId`: ID del préstamo
  - `amount`: Monto a pagar
- **Emite:** `LoanRepaid` o `LoanPartiallyRepaid`

##### `getLoan(uint256 loanId)`
Obtiene información de un préstamo.

##### `getBorrowerLoans(address borrower)`
Obtiene todos los préstamos de un prestatario.

##### `calculateTotalOwed(uint256 loanId)`
Calcula el monto total adeudado de un préstamo.

### SavingsPool.sol

**Dirección:** `0x...` (actualizar después del deployment)

**Propósito:** Fondo comunitario de ahorro con intereses.

#### Funciones Principales

##### `deposit(uint256 amount)`
Realiza un depósito de ahorro.
- **Parámetros:**
  - `amount`: Monto a depositar
- **Retorna:** ID del depósito creado
- **Requiere:** Aprobación previa del token
- **Emite:** `DepositCreated`

##### `withdraw(uint256 depositId)`
Retira un depósito con intereses acumulados.
- **Parámetros:**
  - `depositId`: ID del depósito a retirar
- **Emite:** `Withdrawal`

##### `calculateInterest(uint256 depositId)`
Calcula los intereses acumulados de un depósito.

##### `getUserTotalBalance(address user)`
Obtiene el balance total de un usuario (todos sus depósitos activos).

##### `getAvailableForLoans()`
Obtiene el monto disponible para préstamos (después de reserva).

## Eventos Importantes

### AquaPay
- `UserRegistered(address indexed user, string ensName, uint256 meterId)`
- `PaymentReceived(address indexed user, uint256 amount, uint256 billId, bool isStablecoin, string ipfsHash)`

### Billing
- `BillCreated(uint256 indexed billId, address indexed user, uint256 consumption, uint256 amount, uint256 dueDate, string ipfsHash)`
- `BillPaid(uint256 indexed billId, address indexed user, uint256 paidAt)`

### MicroCredit
- `LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 interestRate, uint256 dueDate)`
- `LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount)`

### SavingsPool
- `DepositCreated(uint256 indexed depositId, address indexed depositor, uint256 amount)`
- `Withdrawal(uint256 indexed depositId, address indexed depositor, uint256 amount, uint256 interestEarned)`

## Seguridad

### Roles y Permisos

- **Owner**: Control total del contrato
  - Puede actualizar direcciones de contratos
  - Puede retirar fondos
  - Puede configurar parámetros

- **Biller**: Crear facturas
  - Otorgado/revocado por el owner
  - Solo puede crear facturas

### Medidas de Seguridad

1. **ReentrancyGuard**: Protección contra reentrancy attacks
2. **AccessControl**: Control granular de acceso
3. **Validaciones**: Verificación exhaustiva de inputs
4. **Events**: Registro de todas las operaciones importantes

## Interacciones entre Contratos

```
AquaPay
  ├── Billing (marca facturas como pagadas)
  ├── MicroCredit (puede solicitar préstamos para usuarios)
  └── SavingsPool (puede depositar en ahorros)

Billing
  └── AquaPay (recibe notificaciones de pagos)

MicroCredit
  └── SavingsPool (obtiene fondos para préstamos)

SavingsPool
  └── MicroCredit (proporciona fondos para préstamos)
```

## Testing

Para ejecutar los tests:

```bash
cd packages/contracts
npm run test
```

Los tests cubren:
- Registro de usuarios
- Procesamiento de pagos
- Creación de facturas
- Solicitud de préstamos
- Depósitos de ahorro


