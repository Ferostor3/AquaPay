// Direcciones de contratos desplegados
// Actualizar estas direcciones después del deployment

export const CONTRACTS = {
  // Scroll Sepolia Testnet
  scrollSepolia: {
    aquaPay: import.meta.env.VITE_AQUAPAY_CONTRACT || '0x...',
    billing: import.meta.env.VITE_BILLING_CONTRACT || '0x...',
    microCredit: import.meta.env.VITE_MICROCREDIT_CONTRACT || '0x...',
    savingsPool: import.meta.env.VITE_SAVINGSPOOL_CONTRACT || '0x...',
    stablecoin: import.meta.env.VITE_STABLECOIN_CONTRACT || '0x...', // USDC en Scroll
  },
  // Scroll Mainnet
  scroll: {
    aquaPay: import.meta.env.VITE_AQUAPAY_CONTRACT_MAINNET || '0x...',
    billing: import.meta.env.VITE_BILLING_CONTRACT_MAINNET || '0x...',
    microCredit: import.meta.env.VITE_MICROCREDIT_CONTRACT_MAINNET || '0x...',
    savingsPool: import.meta.env.VITE_SAVINGSPOOL_CONTRACT_MAINNET || '0x...',
    stablecoin: import.meta.env.VITE_STABLECOIN_CONTRACT_MAINNET || '0x...',
  },
}

// ABI de los contratos (abreviado para ejemplo)
export const AQUAPAY_ABI = [
  'function registerUser(string memory ensName, uint256 waterMeterId) external',
  'function payWithStablecoin(uint256 amount, uint256 billId, string memory ipfsHash) external',
  'function getUserInfo(address user) external view returns (tuple(address userAddress, string ensName, uint256 waterMeterId, bool isActive, uint256 createdAt))',
  'function getUserPayments(address user) external view returns (tuple(address user, uint256 amount, uint256 timestamp, uint256 billId, string ipfsHash, bool isStablecoin)[])',
  'function totalUsers() external view returns (uint256)',
  'function totalRevenue() external view returns (uint256)',
  'event PaymentReceived(address indexed user, uint256 amount, uint256 billId, bool isStablecoin, string ipfsHash)',
  'event UserRegistered(address indexed user, string ensName, uint256 meterId)',
] as const

export const BILLING_ABI = [
  'function createBill(address user, uint256 consumption, uint256 dueDate, string memory ipfsHash, string memory metadata) external returns (uint256)',
  'function createBillsBatch(address[] memory users, uint256[] memory consumptions, uint256 dueDate, string[] memory ipfsHashes, string[] memory metadataArray) external returns (uint256[] memory)',
  'function getBill(uint256 billId) external view returns (tuple(uint256 billId, address user, uint256 consumption, uint256 amount, uint256 dueDate, uint256 createdAt, bool isPaid, uint256 paidAt, string ipfsHash, string metadata))',
  'function getUserBills(address user) external view returns (tuple(uint256 billId, address user, uint256 consumption, uint256 amount, uint256 dueDate, uint256 createdAt, bool isPaid, uint256 paidAt, string ipfsHash, string metadata)[])',
  'function getUnpaidBills(address user) external view returns (tuple(uint256 billId, address user, uint256 consumption, uint256 amount, uint256 dueDate, uint256 createdAt, bool isPaid, uint256 paidAt, string ipfsHash, string metadata)[])',
  'function totalBills() external view returns (uint256)',
  'function totalUnpaidBills() external view returns (uint256)',
  'function pricePerLiter() external view returns (uint256)',
  'function setPricePerLiter(uint256 newPrice) external',
  'event BillCreated(uint256 indexed billId, address indexed user, uint256 consumption, uint256 amount, uint256 dueDate, string ipfsHash)',
  'event PricePerLiterUpdated(uint256 newPrice)',
] as const

export const MICROCREDIT_ABI = [
  'function requestLoan(uint256 amount, uint256 term, string memory purpose) external returns (uint256)',
  'function repayLoan(uint256 loanId, uint256 amount) external',
  'function getLoan(uint256 loanId) external view returns (tuple(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 term, uint256 dueDate, uint256 createdAt, uint256 principalPaid, uint256 interestPaid, bool isActive, bool isRepaid, string purpose))',
  'function getBorrowerLoans(address borrower) external view returns (tuple(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 term, uint256 dueDate, uint256 createdAt, uint256 principalPaid, uint256 interestPaid, bool isActive, bool isRepaid, string purpose)[])',
  'function calculateTotalOwed(uint256 loanId) external view returns (uint256)',
] as const

export const SAVINGSPOOL_ABI = [
  'function deposit(uint256 amount) external returns (uint256)',
  'function withdraw(uint256 depositId) external',
  'function getDeposit(uint256 depositId) external view returns (tuple(uint256 depositId, address depositor, uint256 amount, uint256 timestamp, uint256 interestEarned, bool isActive))',
  'function getUserDeposits(address user) external view returns (tuple(uint256 depositId, address depositor, uint256 amount, uint256 timestamp, uint256 interestEarned, bool isActive)[])',
  'function getUserTotalBalance(address user) external view returns (uint256)',
  'function calculateInterest(uint256 depositId) external view returns (uint256)',
] as const

export const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
] as const

