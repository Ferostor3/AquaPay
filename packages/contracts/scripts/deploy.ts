import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying contracts with account:", deployerAddress);

  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // --- Deploy SavingsPool ---
  const SavingsPoolFactory = await ethers.getContractFactory("SavingsPool");
  const savingsPool = await SavingsPoolFactory.deploy(deployerAddress); // admin
  await savingsPool.waitForDeployment();
  console.log("📦 SavingsPool deployed at:", savingsPool.target);

  // --- Deploy MockERC20 como stablecoin (solo testnet) ---
  const MockERC20Factory = await ethers.getContractFactory("MockERC20");
  const stablecoin = await MockERC20Factory.deploy("Mock USDC", "mUSDC", 6);
  await stablecoin.waitForDeployment();
  console.log("📦 Stablecoin deployed at:", stablecoin.target);

  // --- Deploy AquaPay ---
  const AquaPayFactory = await ethers.getContractFactory("AquaPay");
  const aquaPay = await AquaPayFactory.deploy(stablecoin.target); // necesita stablecoin
  await aquaPay.waitForDeployment();
  console.log("📦 AquaPay deployed at:", aquaPay.target);

  // --- Deploy Billing ---
  const BillingFactory = await ethers.getContractFactory("Billing");
  const billing = await BillingFactory.deploy(aquaPay.target); // necesita AquaPay
  await billing.waitForDeployment();
  console.log("📦 Billing deployed at:", billing.target);

  // --- Deploy MicroCredit ---
  const MicroCreditFactory = await ethers.getContractFactory("MicroCredit");
  const microCredit = await MicroCreditFactory.deploy(
    stablecoin.target, // stablecoin
    aquaPay.target,    // AquaPay
    savingsPool.target // community pool
  );
  await microCredit.waitForDeployment();
  console.log("📦 MicroCredit deployed at:", microCredit.target);

  // --- Configurar contratos en AquaPay ---
  await aquaPay.setContracts(billing.target, microCredit.target, savingsPool.target);
  console.log("✅ AquaPay configured with auxiliary contracts");

  console.log("✅ All contracts deployed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
