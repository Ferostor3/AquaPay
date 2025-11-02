// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Billing.sol";
import "./MicroCredit.sol";
import "./SavingsPool.sol";

/**
 * @title AquaPay
 * @notice Contrato principal para el sistema de pagos descentralizado de agua
 * @dev Gestiona pagos, facturación, microcréditos y ahorro comunitario
 */
contract AquaPay is Ownable, ReentrancyGuard {
    // ============ Structs ============
    struct User {
        address userAddress;
        string ensName; // ej: "casa123.aguapay.eth"
        uint256 waterMeterId;
        bool isActive;
        uint256 createdAt;
    }

    struct Payment {
        address user;
        uint256 amount;
        uint256 timestamp;
        uint256 billId;
        string ipfsHash; // Hash de la factura en IPFS
        bool isStablecoin; // true si fue pago con stablecoin, false si fue fiat
    }

    // ============ State Variables ============
    mapping(address => User) public users;
    mapping(string => address) public ensToAddress; // ENS name => address
    mapping(uint256 => address) public meterToAddress; // Meter ID => address
    
    address public stablecoinToken; // USDC o DAI
    address public billingContract;
    address public microCreditContract;
    address public savingsPoolContract;
    
    uint256 public totalUsers;
    uint256 public totalRevenue;
    
    Payment[] public payments;
    mapping(address => uint256[]) public userPayments; // User => Payment IDs

    // ============ Events ============
    event UserRegistered(address indexed user, string ensName, uint256 meterId);
    event PaymentReceived(
        address indexed user,
        uint256 amount,
        uint256 billId,
        bool isStablecoin,
        string ipfsHash
    );
    event StablecoinSet(address indexed token);
    event ContractsUpdated(
        address billing,
        address microCredit,
        address savingsPool
    );

    // ============ Constructor ============
    constructor(address _stablecoinToken) Ownable(msg.sender) {
        require(_stablecoinToken != address(0), "Invalid stablecoin address");
        stablecoinToken = _stablecoinToken;
        emit StablecoinSet(_stablecoinToken);
    }

    // ============ User Registration ============
    /**
     * @notice Registra un nuevo usuario en el sistema
     * @param ensName Nombre ENS del usuario (ej: "casa123.aguapay.eth")
     * @param waterMeterId ID único del medidor de agua
     */
    function registerUser(string memory ensName, uint256 waterMeterId) external {
        require(users[msg.sender].createdAt == 0, "User already registered");
        require(bytes(ensName).length > 0, "ENS name required");
        require(ensToAddress[ensName] == address(0), "ENS name already taken");
        require(meterToAddress[waterMeterId] == address(0), "Meter ID already taken");

        users[msg.sender] = User({
            userAddress: msg.sender,
            ensName: ensName,
            waterMeterId: waterMeterId,
            isActive: true,
            createdAt: block.timestamp
        });

        ensToAddress[ensName] = msg.sender;
        meterToAddress[waterMeterId] = msg.sender;
        totalUsers++;

        emit UserRegistered(msg.sender, ensName, waterMeterId);
    }

    // ============ Payment Functions ============
    /**
     * @notice Realiza un pago con stablecoin (USDC/DAI)
     * @param amount Monto a pagar (en unidades del token, ej: 1000000 = 1 USDC)
     * @param billId ID de la factura asociada
     * @param ipfsHash Hash IPFS de la factura/comprobante
     */
    function payWithStablecoin(
        uint256 amount,
        uint256 billId,
        string memory ipfsHash
    ) external nonReentrant {
        require(users[msg.sender].isActive, "User not active");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(stablecoinToken);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Transferir tokens
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Registrar pago
        uint256 paymentId = payments.length;
        payments.push(Payment({
            user: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            billId: billId,
            ipfsHash: ipfsHash,
            isStablecoin: true
        }));

        userPayments[msg.sender].push(paymentId);
        totalRevenue += amount;

        // Notificar al contrato de facturación
        if (billingContract != address(0)) {
            Billing(billingContract).markBillAsPaid(billId, msg.sender);
        }

        emit PaymentReceived(msg.sender, amount, billId, true, ipfsHash);
    }

    /**
     * @notice Registra un pago realizado con fiat (pesos mexicanos vía pasarela)
     * @param user Usuario que realizó el pago
     * @param amount Monto pagado (en unidades equivalentes, ej: 1000000 = 1 USD)
     * @param billId ID de la factura
     * @param ipfsHash Hash IPFS del comprobante
     */
    function registerFiatPayment(
        address user,
        uint256 amount,
        uint256 billId,
        string memory ipfsHash
    ) external onlyOwner {
        require(users[user].isActive, "User not active");
        require(amount > 0, "Amount must be greater than 0");

        uint256 paymentId = payments.length;
        payments.push(Payment({
            user: user,
            amount: amount,
            timestamp: block.timestamp,
            billId: billId,
            ipfsHash: ipfsHash,
            isStablecoin: false
        }));

        userPayments[user].push(paymentId);
        totalRevenue += amount;

        if (billingContract != address(0)) {
            Billing(billingContract).markBillAsPaid(billId, user);
        }

        emit PaymentReceived(user, amount, billId, false, ipfsHash);
    }

    // ============ View Functions ============
    /**
     * @notice Obtiene información de un usuario
     */
    function getUserInfo(address user) external view returns (User memory) {
        return users[user];
    }

    /**
     * @notice Obtiene todos los pagos de un usuario
     */
    function getUserPayments(address user) external view returns (Payment[] memory) {
        uint256[] memory paymentIds = userPayments[user];
        Payment[] memory userPaymentList = new Payment[](paymentIds.length);
        
        for (uint256 i = 0; i < paymentIds.length; i++) {
            userPaymentList[i] = payments[paymentIds[i]];
        }
        
        return userPaymentList;
    }

    /**
     * @notice Obtiene el número total de pagos
     */
    function getTotalPayments() external view returns (uint256) {
        return payments.length;
    }

    /**
     * @notice Obtiene un pago por ID
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(paymentId < payments.length, "Payment does not exist");
        return payments[paymentId];
    }

    // ============ Admin Functions ============
    /**
     * @notice Configura las direcciones de los contratos auxiliares
     */
    function setContracts(
        address _billingContract,
        address _microCreditContract,
        address _savingsPoolContract
    ) external onlyOwner {
        billingContract = _billingContract;
        microCreditContract = _microCreditContract;
        savingsPoolContract = _savingsPoolContract;
        
        emit ContractsUpdated(_billingContract, _microCreditContract, _savingsPoolContract);
    }

    /**
     * @notice Actualiza el token stablecoin aceptado
     */
    function setStablecoin(address _stablecoinToken) external onlyOwner {
        require(_stablecoinToken != address(0), "Invalid address");
        stablecoinToken = _stablecoinToken;
        emit StablecoinSet(_stablecoinToken);
    }

    /**
     * @notice Activa o desactiva un usuario
     */
    function setUserActive(address user, bool active) external onlyOwner {
        require(users[user].createdAt != 0, "User does not exist");
        users[user].isActive = active;
    }

    /**
     * @notice Retira fondos del contrato (solo owner)
     */
    function withdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            // ETH
            payable(owner()).transfer(amount);
        } else {
            // ERC20
            IERC20(token).transfer(owner(), amount);
        }
    }

    /**
     * @notice Obtiene el balance del contrato en stablecoins
     */
    function getContractBalance() external view returns (uint256) {
        return IERC20(stablecoinToken).balanceOf(address(this));
    }
}

