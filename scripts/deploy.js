const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ContractFactory = await hre.ethers.getContractFactory("NFTMarketplace");
  const contract = await ContractFactory.deploy(/* constructor arguments */);

  console.log("Contract address:", contract.address);

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
