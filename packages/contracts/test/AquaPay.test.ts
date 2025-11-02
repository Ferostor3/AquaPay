import { expect } from "chai";
import { ethers } from "hardhat";
import { AquaPay, Billing, MicroCredit, SavingsPool } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("AquaPay Web3", function () {
  let aquaPay: AquaPay;
  let billing: Billing;
  let microCredit: MicroCredit;
  let savingsPool: SavingsPool;
  let mockToken: any;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("USDC Mock", "USDC", 6);
    await mockToken.waitForDeployment();

    // Deploy SavingsPool
    const SavingsPoolFactory = await ethers.getContractFactory("SavingsPool");
    savingsPool = await SavingsPoolFactory.deploy(await mockToken.getAddress());
    await savingsPool.waitForDeployment();

    // Deploy AquaPay
    const AquaPayFactory = await ethers.getContractFactory("AquaPay");
    aquaPay = await AquaPayFactory.deploy(await mockToken.getAddress());
    await aquaPay.waitForDeployment();

    // Deploy Billing
    const BillingFactory = await ethers.getContractFactory("Billing");
    billing = await BillingFactory.deploy(await aquaPay.getAddress());
    await billing.waitForDeployment();

    // Deploy MicroCredit
    const MicroCreditFactory = await ethers.getContractFactory("MicroCredit");
    microCredit = await MicroCreditFactory.deploy(
      await mockToken.getAddress(),
      await aquaPay.getAddress(),
      await savingsPool.getAddress()
    );
    await microCredit.waitForDeployment();

    // Configure contracts
    await aquaPay.setContracts(
      await billing.getAddress(),
      await microCredit.getAddress(),
      await savingsPool.getAddress()
    );
    await savingsPool.setContracts(await aquaPay.getAddress(), await microCredit.getAddress());
    await billing.setAquaPayContract(await aquaPay.getAddress());
  });

  describe("User Registration", function () {
    it("Should register a new user", async function () {
      await aquaPay.connect(user1).registerUser("casa123.aguapay.eth", 1);
      const userInfo = await aquaPay.getUserInfo(user1.address);
      expect(userInfo.ensName).to.equal("casa123.aguapay.eth");
      expect(userInfo.waterMeterId).to.equal(1);
      expect(userInfo.isActive).to.be.true;
    });

    it("Should not allow duplicate ENS names", async function () {
      await aquaPay.connect(user1).registerUser("casa123.aguapay.eth", 1);
      await expect(
        aquaPay.connect(user2).registerUser("casa123.aguapay.eth", 2)
      ).to.be.revertedWith("ENS name already taken");
    });
  });

  describe("Payments", function () {
    beforeEach(async function () {
      await aquaPay.connect(user1).registerUser("casa123.aguapay.eth", 1);
      
      // Mint tokens to user1
      await mockToken.mint(user1.address, ethers.parseUnits("1000", 6));
      await mockToken.connect(user1).approve(await aquaPay.getAddress(), ethers.MaxUint256);
    });

    it("Should process payment with stablecoin", async function () {
      const amount = ethers.parseUnits("100", 6); // 100 USDC
      
      await expect(
        aquaPay.connect(user1).payWithStablecoin(amount, 0, "QmHash123")
      ).to.emit(aquaPay, "PaymentReceived");
    });
  });
});


