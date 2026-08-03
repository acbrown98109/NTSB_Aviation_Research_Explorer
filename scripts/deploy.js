import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying AviChainAnchor with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");

  const AviChainAnchor = await hre.ethers.getContractFactory("AviChainAnchor");
  const contract = await AviChainAnchor.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ AviChainAnchor deployed to:", address);
  console.log("Network: Polygon Amoy testnet (chainId 80002)");
  console.log("Explorer: https://www.oklink.com/amoy/address/" + address);
  console.log("\nNext step: set AVICHAIN_CONTRACT_ADDRESS=" + address + " in .env");
  console.log("Then open blockchain-aviation-db.html and connect MetaMask to Polygon Amoy.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
