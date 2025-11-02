// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SavingsPool
 * @notice Fondo comunitario de ahorro con intereses
 * @dev Permite a los usuarios ahorrar stablecoins y ganar intereses, además de servir como fondo para microcréditos
 */
contract SavingsPool is Ownable, ReentrancyGuard {
    // ============ Structs ============
    struct Deposit {
        uint256 depositId;
        address depositor;
        uint256 amount;
        uint256 timestamp;
        uint256 interestEarned;
        bool isActive;
    }

    // ============ State Variables ============
    address public stablecoinToken;
    address public aquaPayContract;
    address public microCreditContract;
    
    mapping(uint256 => Deposit) public deposits;
    mapping(address => uint256[]) public userDeposits;
    
    uint256 public totalDeposits;
    uint256 public totalDepositedAmount;
    uint256 public annualInterestRate; // Tasa de interés anual (en basis points, ej: 300 = 3%)
    uint256 public minimumDeposit;
    
    uint256 public totalInterestPaid;
    uint256 public reserveRatio; // Porcentaje que se mantiene en reserva (en basis points, ej: 5000 = 50%)

    // ============ Events ============
    event DepositCreated(
        uint256 indexed depositId,
        address indexed depositor,
        uint256 amount
    );
    event Withdrawal(
        uint256 indexed depositId,
        address indexed depositor,
        uint256 amount,
        uint256 interestEarned
    );
    event InterestRateUpdated(uint256 newRate);
    event MinimumDepositUpdated(uint256 newAmount);
    event ReserveRatioUpdated(uint256 newRatio);

    // ============ Constructor ============
    constructor(address _stablecoinToken) Ownable(msg.sender) {
        require(_stablecoinToken != address(0), "Invalid token address");
        
        stablecoinToken = _stablecoinToken;
        annualInterestRate = 300; // 3% anual por defecto
        minimumDeposit = 100000; // 0.1 tokens mínimo
        reserveRatio = 5000; // 50% en reserva por defecto
    }

    // ============ Modifiers ============
    modifier onlyAuthorized() {
        require(
            msg.sender == aquaPayContract || 
            msg.sender == microCreditContract || 
            msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    // ============ Deposit Functions ============
    /**
     * @notice Realiza un depósito de ahorro
     * @param amount Monto a depositar
     * @return depositId ID del depósito creado
     */
    function deposit(uint256 amount) external nonReentrant returns (uint256) {
        require(amount >= minimumDeposit, "Amount below minimum deposit");
        
        IERC20 token = IERC20(stablecoinToken);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Transferir tokens
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 depositId = totalDeposits;
        
        deposits[depositId] = Deposit({
            depositId: depositId,
            depositor: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            interestEarned: 0,
            isActive: true
        });

        userDeposits[msg.sender].push(depositId);
        totalDeposits++;
        totalDepositedAmount += amount;

        emit DepositCreated(depositId, msg.sender, amount);
        return depositId;
    }

    /**
     * @notice Retira un depósito con intereses acumulados
     * @param depositId ID del depósito a retirar
     */
    function withdraw(uint256 depositId) external nonReentrant {
        require(deposits[depositId].isActive, "Deposit not active");
        require(deposits[depositId].depositor == msg.sender, "Not the depositor");

        Deposit storage userDeposit = deposits[depositId];
        
        // Calcular intereses acumulados
        uint256 daysElapsed = (block.timestamp - userDeposit.timestamp) / 1 days;
        uint256 interest = (userDeposit.amount * annualInterestRate * daysElapsed) / (10000 * 365);
        
        uint256 totalAmount = userDeposit.amount + interest;
        
        // Verificar que el contrato tiene suficientes fondos
        IERC20 token = IERC20(stablecoinToken);
        require(token.balanceOf(address(this)) >= totalAmount, "Insufficient pool funds");

        // Verificar reserva mínima si otros contratos dependen de este pool
        if (microCreditContract != address(0)) {
            uint256 reserveAmount = (totalDepositedAmount * reserveRatio) / 10000;
            uint256 availableBalance = token.balanceOf(address(this)) - reserveAmount;
            require(availableBalance >= totalAmount, "Withdrawal would breach reserve");
        }

        // Marcar depósito como inactivo
        userDeposit.isActive = false;
        userDeposit.interestEarned = interest;
        
        totalDepositedAmount -= userDeposit.amount;
        totalInterestPaid += interest;

        // Transferir tokens
        require(token.transfer(msg.sender, totalAmount), "Transfer failed");

        emit Withdrawal(depositId, msg.sender, userDeposit.amount, interest);
    }

    // ============ Interest Calculation ============
    /**
     * @notice Calcula los intereses acumulados de un depósito
     */
    function calculateInterest(uint256 depositId) external view returns (uint256) {
        require(deposits[depositId].depositId == depositId, "Deposit does not exist");
        
        Deposit memory userDeposit = deposits[depositId];
        if (!userDeposit.isActive) {
            return userDeposit.interestEarned;
        }

        uint256 daysElapsed = (block.timestamp - userDeposit.timestamp) / 1 days;
        return (userDeposit.amount * annualInterestRate * daysElapsed) / (10000 * 365);
    }

    /**
     * @notice Calcula el balance total (depósito + intereses) de un depósito
     */
    function getDepositBalance(uint256 depositId) external view returns (uint256) {
        require(deposits[depositId].depositId == depositId, "Deposit does not exist");
        
        Deposit memory userDeposit = deposits[depositId];
        uint256 interest = this.calculateInterest(depositId);
        
        return userDeposit.amount + interest;
    }

    // ============ View Functions ============
    /**
     * @notice Obtiene información de un depósito
     */
    function getDeposit(uint256 depositId) external view returns (Deposit memory) {
        require(deposits[depositId].depositId == depositId, "Deposit does not exist");
        return deposits[depositId];
    }

    /**
     * @notice Obtiene todos los depósitos de un usuario
     */
    function getUserDeposits(address user) external view returns (Deposit[] memory) {
        uint256[] memory depositIds = userDeposits[user];
        Deposit[] memory userDepositList = new Deposit[](depositIds.length);

        for (uint256 i = 0; i < depositIds.length; i++) {
            userDepositList[i] = deposits[depositIds[i]];
        }

        return userDepositList;
    }

    /**
     * @notice Obtiene el balance total de un usuario (todos sus depósitos activos)
     */
    function getUserTotalBalance(address user) external view returns (uint256) {
        uint256[] memory depositIds = userDeposits[user];
        uint256 totalBalance = 0;

        for (uint256 i = 0; i < depositIds.length; i++) {
            Deposit memory userDeposit = deposits[depositIds[i]];
            if (userDeposit.isActive) {
                uint256 interest = this.calculateInterest(depositIds[i]);
                totalBalance += userDeposit.amount + interest;
            }
        }

        return totalBalance;
    }

    /**
     * @notice Obtiene el monto disponible para préstamos (después de reserva)
     */
    function getAvailableForLoans() external view returns (uint256) {
        IERC20 token = IERC20(stablecoinToken);
        uint256 totalBalance = token.balanceOf(address(this));
        uint256 reserveAmount = (totalDepositedAmount * reserveRatio) / 10000;
        
        return totalBalance > reserveAmount ? totalBalance - reserveAmount : 0;
    }

    // ============ Admin Functions ============
    /**
     * @notice Configura las direcciones de contratos auxiliares
     */
    function setContracts(
        address _aquaPayContract,
        address _microCreditContract
    ) external onlyOwner {
        aquaPayContract = _aquaPayContract;
        microCreditContract = _microCreditContract;
    }

    /**
     * @notice Actualiza la tasa de interés anual
     */
    function setAnnualInterestRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Interest rate too high"); // Máximo 10%
        annualInterestRate = newRate;
        emit InterestRateUpdated(newRate);
    }

    /**
     * @notice Actualiza el depósito mínimo
     */
    function setMinimumDeposit(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Amount must be greater than 0");
        minimumDeposit = newAmount;
        emit MinimumDepositUpdated(newAmount);
    }

    /**
     * @notice Actualiza el ratio de reserva
     */
    function setReserveRatio(uint256 newRatio) external onlyOwner {
        require(newRatio <= 10000, "Ratio must be <= 100%");
        reserveRatio = newRatio;
        emit ReserveRatioUpdated(newRatio);
    }

    /**
     * @notice Retira fondos del contrato (solo owner, para emergencias)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @notice Obtiene el balance total del contrato
     */
    function getContractBalance() external view returns (uint256) {
        return IERC20(stablecoinToken).balanceOf(address(this));
    }
}

