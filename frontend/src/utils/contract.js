// ⛓️ Ethers v6-style Smart Contract Connector
import { BrowserProvider, Contract } from "ethers";
import artifact from "./MedicalRecordABI.json";
const MedicalRecordABI = artifact.abi;

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export const fetchAllRecords = async () => {
    const contract = await getMedicalRecordContract();
    if (!contract) {
        throw new Error("Gagal mendapatkan instance kontrak.");
    }
    return await contract.getAllRecords();
};

export const getMedicalRecordContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask tidak terinstal. Mohon instal MetaMask untuk menggunakan DApp ini.");
    }

    const provider = new BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    console.log("🧾 Connected MetaMask address:", address);

    return new Contract(CONTRACT_ADDRESS, MedicalRecordABI, signer);
  } catch (err) {
    console.error("⚠️ Gagal terhubung ke smart contract:", err);
    if (err.message.includes("MetaMask not installed")) {
      alert("MetaMask tidak terinstal. Mohon instal MetaMask.");
    } else if (err.code === "UNSUPPORTED_OPERATION" && err.message.includes("network")) {
      alert("Gagal terhubung ke jaringan. Pastikan MetaMask terhubung ke jaringan yang benar (misalnya Hardhat localhost).");
    } else {
      alert("Gagal menginisialisasi smart contract. Pastikan MetaMask sudah terbuka dan terhubung.");
    }
    throw new Error("Gagal menginisialisasi smart contract.");
  }
};

export const getProvider = async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" }); 
        return new BrowserProvider(window.ethereum);
    }
    return null;
};