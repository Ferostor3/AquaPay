import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Deploying AquaPay Web3 Contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Dirección del token stablecoin (USDC en Scroll Sepolia)
  // Para testnet, puedes usar un mock token o la dirección real de USDC
  const STABLECOIN_ADDRESS = process.env.STABLECOIN_ADDRESS || "0x..."; // Actualizar con la dirección real

  // 1. Deploy SavingsPool (necesita ser primero porque otros contratos lo referencian)
  console.log("📦 Deploying SavingsPool...");
  const SavingsPool = await ethers.getContractFactory("SavingsPool");
  const savingsPool = await SavingsPool.deploy(STABLECOIN_ADDRESS);
  await savingsPool.waitForDeployment();
  const savingsPoolAddress = await savingsPool.getAddress();
  console.log("✅ SavingsPool deployed to:", savingsPoolAddress);

  // 2. Deploy AquaPay
  console.log("\n📦 Deploying AquaPay...");
  const AquaPay = await ethers.getContractFactory("AquaPay");
  const aquaPay = await AquaPay.deploy(STABLECOIN_ADDRESS);
  await aquaPay.waitForDeployment();
  const aquaPayAddress = await aquaPay.getAddress();
  console.log("✅ AquaPay deployed to:", aquaPayAddress);

  // 3. Deploy Billing
  console.log("\n📦 Deploying Billing...");
  const Billing = await ethers.getContractFactory("Billing");
  const billing = await Billing.deploy(aquaPayAddress);
  await billing.waitForDeployment();
  const billingAddress = await billing.getAddress();
  console.log("✅ Billing deployed to:", billingAddress);

  // 4. Deploy MicroCredit
  console.log("\n📦 Deploying MicroCredit...");
  const MicroCredit = await ethers.getContractFactory("MicroCredit");
  const microCredit = await MicroCredit.deploy(STABLECOIN_ADDRESS, aquaPayAddress, savingsPoolAddress);
  await microCredit.waitForDeployment();
  const microCreditAddress = await microCredit.getAddress();
  console.log("✅ MicroCredit deployed to:", microCreditAddress);

  // 5. Configurar interconexiones
  console.log("\n🔗 Configuring contract connections...");
  
  // Configurar contratos en AquaPay
  await aquaPay.setContracts(billingAddress, microCreditAddress, savingsPoolAddress);
  console.log("✅ Connected contracts to AquaPay");

  // Configurar contratos en SavingsPool
  await savingsPool.setContracts(aquaPayAddress, microCreditAddress);
  console.log("✅ Connected contracts to SavingsPool");

  // Configurar Billing con AquaPay
  await billing.setAquaPayContract(aquaPayAddress);
  console.log("✅ Connected Billing to AquaPay");

  console.log("\n✨ Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SavingsPool:", savingsPoolAddress);
  console.log("AquaPay:", aquaPayAddress);
  console.log("Billing:", billingAddress);
  console.log("MicroCredit:", microCreditAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Guardar direcciones en un archivo (opcional)
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      savingsPool: savingsPoolAddress,
      aquaPay: aquaPayAddress,
      billing: billingAddress,
      microCredit: microCreditAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("📝 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });


