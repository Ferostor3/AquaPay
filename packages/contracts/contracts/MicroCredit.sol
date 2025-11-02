// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MicroCredit
 * @notice Sistema de microcréditos comunitarios para usuarios que no pueden pagar a tiempo
 * @dev Permite solicitar préstamos respaldados por un fondo comunitario
 */
contract MicroCredit is Ownable, ReentrancyGuard {
    // ============ Structs ============
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 amount;
        uint256 interestRate; // Tasa de interés (en basis points, ej: 500 = 5%)
        uint256 term; // Duración del préstamo en días
        uint256 dueDate;
        uint256 createdAt;
        uint256 principalPaid;
        uint256 interestPaid;
        bool isActive;
        bool isRepaid;
        string purpose; // Propósito del préstamo
    }

    // ============ State Variables ============
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    
    address public stablecoinToken;
    address public aquaPayContract;
    address public communityPool; // Fondo comunitario
    
    uint256 public totalLoans;
    uint256 public activeLoans;
    uint256 public defaultInterestRate; // Tasa de interés por defecto (500 = 5%)
    uint256 public maxLoanAmount;
    uint256 public minLoanAmount;
    
    uint256 public totalLent;
    uint256 public totalRepaid;

    // ============ Events ============
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 dueDate
    );
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanPartiallyRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event DefaultInterestRateUpdated(uint256 newRate);
    event MaxLoanAmountUpdated(uint256 newAmount);
    event CommunityPoolUpdated(address newPool);

    // ============ Constructor ============
    constructor(
        address _stablecoinToken,
        address _aquaPayContract,
        address _communityPool
    ) Ownable(msg.sender) {
        require(_stablecoinToken != address(0), "Invalid token address");
        require(_aquaPayContract != address(0), "Invalid AquaPay address");
        require(_communityPool != address(0), "Invalid pool address");
        
        stablecoinToken = _stablecoinToken;
        aquaPayContract = _aquaPayContract;
        communityPool = _communityPool;
        
        defaultInterestRate = 500; // 5% por defecto
        maxLoanAmount = 1000000000; // 1000 tokens (ajustable)
        minLoanAmount = 100000; // 0.1 tokens (ajustable)
    }

    // ============ Modifiers ============
    modifier onlyAquaPay() {
        require(msg.sender == aquaPayContract, "Only AquaPay can call this");
        _;
    }

    // ============ Loan Functions ============
    /**
     * @notice Solicita un microcrédito
     * @param amount Monto solicitado
     * @param term Duración del préstamo en días
     * @param purpose Propósito del préstamo
     * @return loanId ID del préstamo creado
     */
    function requestLoan(
        uint256 amount,
        uint256 term,
        string memory purpose
    ) external nonReentrant returns (uint256) {
        require(amount >= minLoanAmount && amount <= maxLoanAmount, "Invalid loan amount");
        require(term > 0 && term <= 365, "Invalid term");
        require(bytes(purpose).length > 0, "Purpose required");

        // Verificar que el fondo comunitario tiene suficientes fondos
        IERC20 token = IERC20(stablecoinToken);
        require(
            token.balanceOf(communityPool) >= amount,
            "Insufficient funds in community pool"
        );

        // Calcular fecha de vencimiento
        uint256 dueDate = block.timestamp + (term * 1 days);
        
        // Calcular interés total
        uint256 interest = (amount * defaultInterestRate * term) / (10000 * 365);

        uint256 loanId = totalLoans;
        
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            amount: amount,
            interestRate: defaultInterestRate,
            term: term,
            dueDate: dueDate,
            createdAt: block.timestamp,
            principalPaid: 0,
            interestPaid: 0,
            isActive: true,
            isRepaid: false,
            purpose: purpose
        });

        borrowerLoans[msg.sender].push(loanId);
        totalLoans++;
        activeLoans++;
        totalLent += amount;

        // Transferir fondos desde el pool comunitario
        require(
            token.transferFrom(communityPool, msg.sender, amount),
            "Transfer from pool failed"
        );

        emit LoanCreated(loanId, msg.sender, amount, defaultInterestRate, dueDate);
        return loanId;
    }

    /**
     * @notice Paga un préstamo (total o parcial)
     * @param loanId ID del préstamo
     * @param amount Monto a pagar
     */
    function repayLoan(uint256 loanId, uint256 amount) external nonReentrant {
        require(loans[loanId].isActive, "Loan not active");
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        require(amount > 0, "Amount must be greater than 0");

        Loan storage loan = loans[loanId];
        
        IERC20 token = IERC20(stablecoinToken);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Calcular intereses pendientes
        uint256 daysElapsed = (block.timestamp - loan.createdAt) / 1 days;
        uint256 totalInterest = (loan.amount * loan.interestRate * daysElapsed) / (10000 * 365);
        uint256 totalOwed = loan.amount + totalInterest;
        uint256 remainingDebt = totalOwed - loan.principalPaid - loan.interestPaid;

        require(amount <= remainingDebt, "Amount exceeds remaining debt");

        // Transferir tokens
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Distribuir el pago: primero intereses, luego principal
        uint256 interestToPay = loan.interestPaid < totalInterest 
            ? (totalInterest - loan.interestPaid < amount ? totalInterest - loan.interestPaid : amount)
            : 0;
        
        uint256 principalToPay = amount - interestToPay;
        
        loan.interestPaid += interestToPay;
        loan.principalPaid += principalToPay;
        
        totalRepaid += amount;

        // Si el préstamo está completamente pagado
        if (loan.principalPaid >= loan.amount && loan.interestPaid >= totalInterest) {
            loan.isActive = false;
            loan.isRepaid = true;
            activeLoans--;
            emit LoanRepaid(loanId, msg.sender, amount);
        } else {
            emit LoanPartiallyRepaid(loanId, msg.sender, amount);
        }
    }

    // ============ View Functions ============
    /**
     * @notice Obtiene información de un préstamo
     */
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        require(loans[loanId].loanId == loanId, "Loan does not exist");
        return loans[loanId];
    }

    /**
     * @notice Obtiene todos los préstamos de un prestatario
     */
    function getBorrowerLoans(address borrower) external view returns (Loan[] memory) {
        uint256[] memory loanIds = borrowerLoans[borrower];
        Loan[] memory borrowerLoanList = new Loan[](loanIds.length);

        for (uint256 i = 0; i < loanIds.length; i++) {
            borrowerLoanList[i] = loans[loanIds[i]];
        }

        return borrowerLoanList;
    }

    /**
     * @notice Calcula el monto total adeudado de un préstamo
     */
    function calculateTotalOwed(uint256 loanId) external view returns (uint256) {
        Loan memory loan = loans[loanId];
        require(loan.loanId == loanId, "Loan does not exist");

        if (loan.isRepaid) return 0;

        uint256 daysElapsed = (block.timestamp - loan.createdAt) / 1 days;
        uint256 totalInterest = (loan.amount * loan.interestRate * daysElapsed) / (10000 * 365);
        uint256 totalOwed = loan.amount + totalInterest;
        uint256 alreadyPaid = loan.principalPaid + loan.interestPaid;

        return totalOwed > alreadyPaid ? totalOwed - alreadyPaid : 0;
    }

    // ============ Admin Functions ============
    /**
     * @notice Actualiza la tasa de interés por defecto
     */
    function setDefaultInterestRate(uint256 newRate) external onlyOwner {
        require(newRate <= 2000, "Interest rate too high"); // Máximo 20%
        defaultInterestRate = newRate;
        emit DefaultInterestRateUpdated(newRate);
    }

    /**
     * @notice Actualiza el monto máximo de préstamo
     */
    function setMaxLoanAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > minLoanAmount, "Must be greater than min amount");
        maxLoanAmount = newAmount;
        emit MaxLoanAmountUpdated(newAmount);
    }

    /**
     * @notice Actualiza el fondo comunitario
     */
    function setCommunityPool(address newPool) external onlyOwner {
        require(newPool != address(0), "Invalid address");
        communityPool = newPool;
        emit CommunityPoolUpdated(newPool);
    }

    /**
     * @notice Retira fondos del contrato (intereses ganados)
     */
    function withdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @notice Obtiene el balance del contrato
     */
    function getContractBalance() external view returns (uint256) {
        return IERC20(stablecoinToken).balanceOf(address(this));
    }
}

