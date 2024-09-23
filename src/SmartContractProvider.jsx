import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAddresses from "./contracts.json";

import RegistryContractABI from "./artifacts/contracts/RegistryContract.sol/RegistryContract.json";
import DataContractABI from "./artifacts/contracts/DataContract.sol/DataContract.json";
import PermissionContractABI from "./artifacts/contracts/PermissionContract.sol/PermissionContract.json";

const SmartContractContext = createContext();

export const useSmartContracts = () => useContext(SmartContractContext);

export const SmartContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState({
    RegistryContract: null,
    DataContract: null,
    PermissionContract: null,
  });
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initializeEthers = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          const signer = await provider.getSigner();
          setSigner(signer);

          // Initialize contracts
          const registryContract = new ethers.Contract(
            contractAddresses.RegistryContract,
            RegistryContractABI.abi,
            signer
          );

          const dataContract = new ethers.Contract(
            contractAddresses.DataContract,
            DataContractABI.abi,
            signer
          );

          const permissionContract = new ethers.Contract(
            contractAddresses.PermissionContract,
            PermissionContractABI.abi,
            signer
          );

          registryContract.connect(signer.address);
          dataContract.connect(signer.address);
          permissionContract.connect(signer.address);

          setContracts({
            RegistryContract: registryContract,
            DataContract: dataContract,
            PermissionContract: permissionContract,
          });
        } catch (error) {
          console.error("Failed to initialize ethers:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    initializeEthers();
  }, []);

  return (
    <SmartContractContext.Provider value={{ contracts, provider, signer }}>
      {children}
    </SmartContractContext.Provider>
  );
};
