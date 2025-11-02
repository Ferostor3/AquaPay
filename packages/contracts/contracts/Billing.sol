// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Billing
 * @notice Sistema de facturación y gestión de consumo de agua
 * @dev Registra facturas, consumo y estados de pago
 */
contract Billing is Ownable, AccessControl {
    bytes32 public constant BILLER_ROLE = keccak256("BILLER_ROLE");

    // ============ Structs ============
    struct Bill {
        uint256 billId;
        address user;
        uint256 consumption; // Litros consumidos
        uint256 amount; // Monto a pagar (en unidades del token)
        uint256 dueDate; // Fecha de vencimiento (timestamp)
        uint256 createdAt;
        bool isPaid;
        uint256 paidAt;
        string ipfsHash; // Hash de la factura en IPFS
        string metadata; // JSON string con información adicional
    }

    // ============ State Variables ============
    mapping(uint256 => Bill) public bills;
    mapping(address => uint256[]) public userBills; // User => Bill IDs
    
    uint256 public totalBills;
    uint256 public totalUnpaidBills;
    uint256 public pricePerLiter; // Precio por litro (en unidades del token)

    address public aquaPayContract;

    // ============ Events ============
    event BillCreated(
        uint256 indexed billId,
        address indexed user,
        uint256 consumption,
        uint256 amount,
        uint256 dueDate,
        string ipfsHash
    );
    event BillPaid(uint256 indexed billId, address indexed user, uint256 paidAt);
    event PricePerLiterUpdated(uint256 newPrice);
    event AquaPayContractUpdated(address newContract);

    // ============ Constructor ============
    constructor(address _aquaPayContract) Ownable(msg.sender) {
        require(_aquaPayContract != address(0), "Invalid contract address");
        aquaPayContract = _aquaPayContract;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BILLER_ROLE, msg.sender);
        pricePerLiter = 1000; // 0.001 unidades por litro (ajustable)
    }

    // ============ Modifiers ============
    modifier onlyAquaPayOrBiller() {
        require(
            msg.sender == aquaPayContract || hasRole(BILLER_ROLE, msg.sender),
            "Not authorized"
        );
        _;
    }

    // ============ Bill Creation ============
    /**
     * @notice Crea una nueva factura
     * @param user Usuario que debe pagar
     * @param consumption Litros de agua consumidos
     * @param dueDate Fecha de vencimiento (timestamp)
     * @param ipfsHash Hash IPFS de la factura
     * @param metadata JSON string con metadata adicional
     * @return billId ID de la factura creada
     */
    function createBill(
        address user,
        uint256 consumption,
        uint256 dueDate,
        string memory ipfsHash,
        string memory metadata
    ) external onlyRole(BILLER_ROLE) returns (uint256) {
        require(user != address(0), "Invalid user address");
        require(consumption > 0, "Consumption must be greater than 0");
        require(dueDate > block.timestamp, "Due date must be in the future");

        uint256 amount = consumption * pricePerLiter;
        uint256 billId = totalBills;

        bills[billId] = Bill({
            billId: billId,
            user: user,
            consumption: consumption,
            amount: amount,
            dueDate: dueDate,
            createdAt: block.timestamp,
            isPaid: false,
            paidAt: 0,
            ipfsHash: ipfsHash,
            metadata: metadata
        });

        userBills[user].push(billId);
        totalBills++;
        totalUnpaidBills++;

        emit BillCreated(billId, user, consumption, amount, dueDate, ipfsHash);
        return billId;
    }

    /**
     * @notice Crea múltiples facturas en un solo batch
     */
    function createBillsBatch(
        address[] memory users,
        uint256[] memory consumptions,
        uint256 dueDate,
        string[] memory ipfsHashes,
        string[] memory metadataArray
    ) external onlyRole(BILLER_ROLE) returns (uint256[] memory) {
        require(
            users.length == consumptions.length &&
            consumptions.length == ipfsHashes.length &&
            ipfsHashes.length == metadataArray.length,
            "Arrays length mismatch"
        );

        uint256[] memory billIds = new uint256[](users.length);

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 consumption = consumptions[i];
            string memory ipfsHash = ipfsHashes[i];
            string memory metadata = metadataArray[i];
            
            require(user != address(0), "Invalid user address");
            require(consumption > 0, "Consumption must be greater than 0");
            require(dueDate > block.timestamp, "Due date must be in the future");

            uint256 amount = consumption * pricePerLiter;
            uint256 billId = totalBills;

            bills[billId] = Bill({
                billId: billId,
                user: user,
                consumption: consumption,
                amount: amount,
                dueDate: dueDate,
                createdAt: block.timestamp,
                isPaid: false,
                paidAt: 0,
                ipfsHash: ipfsHash,
                metadata: metadata
            });

            userBills[user].push(billId);
            totalBills++;
            totalUnpaidBills++;
            billIds[i] = billId;

            emit BillCreated(billId, user, consumption, amount, dueDate, ipfsHash);
        }

        return billIds;
    }

    // ============ Payment Functions ============
    /**
     * @notice Marca una factura como pagada (llamado por AquaPay)
     */
    function markBillAsPaid(uint256 billId, address user) external onlyAquaPayOrBiller {
        require(bills[billId].billId == billId, "Bill does not exist");
        require(bills[billId].user == user, "Bill does not belong to user");
        require(!bills[billId].isPaid, "Bill already paid");

        bills[billId].isPaid = true;
        bills[billId].paidAt = block.timestamp;
        totalUnpaidBills--;

        emit BillPaid(billId, user, block.timestamp);
    }

    // ============ View Functions ============
    /**
     * @notice Obtiene una factura por ID
     */
    function getBill(uint256 billId) external view returns (Bill memory) {
        require(bills[billId].billId == billId, "Bill does not exist");
        return bills[billId];
    }

    /**
     * @notice Obtiene todas las facturas de un usuario
     */
    function getUserBills(address user) external view returns (Bill[] memory) {
        uint256[] memory billIds = userBills[user];
        Bill[] memory userBillList = new Bill[](billIds.length);

        for (uint256 i = 0; i < billIds.length; i++) {
            userBillList[i] = bills[billIds[i]];
        }

        return userBillList;
    }

    /**
     * @notice Obtiene las facturas pendientes de un usuario
     */
    function getUnpaidBills(address user) external view returns (Bill[] memory) {
        uint256[] memory billIds = userBills[user];
        uint256 unpaidCount = 0;

        // Contar facturas no pagadas
        for (uint256 i = 0; i < billIds.length; i++) {
            if (!bills[billIds[i]].isPaid) {
                unpaidCount++;
            }
        }

        Bill[] memory unpaidBills = new Bill[](unpaidCount);
        uint256 index = 0;

        for (uint256 i = 0; i < billIds.length; i++) {
            if (!bills[billIds[i]].isPaid) {
                unpaidBills[index] = bills[billIds[i]];
                index++;
            }
        }

        return unpaidBills;
    }

    /**
     * @notice Obtiene facturas vencidas de un usuario
     */
    function getOverdueBills(address user) external view returns (Bill[] memory) {
        uint256[] memory billIds = userBills[user];
        uint256 overdueCount = 0;

        for (uint256 i = 0; i < billIds.length; i++) {
            Bill memory bill = bills[billIds[i]];
            if (!bill.isPaid && bill.dueDate < block.timestamp) {
                overdueCount++;
            }
        }

        Bill[] memory overdueBills = new Bill[](overdueCount);
        uint256 index = 0;

        for (uint256 i = 0; i < billIds.length; i++) {
            Bill memory bill = bills[billIds[i]];
            if (!bill.isPaid && bill.dueDate < block.timestamp) {
                overdueBills[index] = bill;
                index++;
            }
        }

        return overdueBills;
    }

    // ============ Admin Functions ============
    /**
     * @notice Actualiza el precio por litro
     */
    function setPricePerLiter(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        pricePerLiter = newPrice;
        emit PricePerLiterUpdated(newPrice);
    }

    /**
     * @notice Actualiza la dirección del contrato AquaPay
     */
    function setAquaPayContract(address _aquaPayContract) external onlyOwner {
        require(_aquaPayContract != address(0), "Invalid address");
        aquaPayContract = _aquaPayContract;
        emit AquaPayContractUpdated(_aquaPayContract);
    }

    /**
     * @notice Otorga rol de BILLER a una dirección
     */
    function grantBillerRole(address account) external onlyOwner {
        grantRole(BILLER_ROLE, account);
    }

    /**
     * @notice Revoca rol de BILLER de una dirección
     */
    function revokeBillerRole(address account) external onlyOwner {
        revokeRole(BILLER_ROLE, account);
    }
}

