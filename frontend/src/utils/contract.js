// ⛓️ Ethers v6-style Smart Contract Connector
import { BrowserProvider, Contract } from "ethers";
import artifact from "./MedicalRecordABI.json";
const MedicalRecordABI = artifact.abi;

// 📍 Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

export const fetchAllRecords = async () => {
    const contract = await getMedicalRecordContract();
    return await contract.getAllRecords();
  };
/**
 * 💡 getMedicalRecordContract
 * Initializes a connection to the deployed MedicalRecord smart contract
 * via MetaMask (BrowserProvider) and returns a signer-connected instance.
 */
export const getMedicalRecordContract = async () => {
  try {
    // Connect to MetaMask's injected provider
    const provider = new BrowserProvider(window.ethereum);

    // Prompt MetaMask for account access & get signer
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    console.log("🧾 Connected MetaMask address:", address);

    // Return contract instance (ready to call functions)
    return new Contract(CONTRACT_ADDRESS, MedicalRecordABI, signer);
  } catch (err) {
    console.error("⚠️ Failed to connect to the smart contract:", err);
    throw new Error("Failed to initialize smart contract. Is MetaMask unlocked?");
  }


  
};
