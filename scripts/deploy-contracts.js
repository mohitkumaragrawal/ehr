import pkg from 'hardhat';
const { ethers } = pkg;

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RegistryContract
  const RegistryContract = await ethers.getContractFactory("RegistryContract");
  const registryContract = await RegistryContract.deploy();
  await registryContract.waitForDeployment();
  console.log("RegistryContract deployed to:", await registryContract.getAddress());

  // Deploy DataContract
  const DataContract = await ethers.getContractFactory("DataContract");
  const dataContract = await DataContract.deploy(await registryContract.getAddress());
  await dataContract.waitForDeployment();
  console.log("DataContract deployed to:", await dataContract.getAddress());

  // Deploy PermissionContract
  const PermissionContract = await ethers.getContractFactory("PermissionContract");
  const permissionContract = await PermissionContract.deploy(await dataContract.getAddress(), await registryContract.getAddress());
  await permissionContract.waitForDeployment();
  console.log("PermissionContract deployed to:", await permissionContract.getAddress());

  // Prepare contract addresses object
  const contractAddresses = {
    RegistryContract: await registryContract.getAddress(),
    DataContract: await dataContract.getAddress(),
    PermissionContract: await permissionContract.getAddress()
  };

  // Write contract addresses to JSON file
  const filePath = path.join(__dirname, '../src/contracts.json');
  await fs.writeFile(filePath, JSON.stringify(contractAddresses, null, 2));
  console.log("Contract addresses written to:", filePath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });