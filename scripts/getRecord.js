const hre = require("hardhat");
const { Contract } = require("ethers");

async function main() {
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // ganti dengan alamat dari hasil deploy
  const [deployer] = await hre.ethers.getSigners();

  const MedicalRecordFactory = await hre.ethers.getContractFactory("MedicalRecord");
  const abi = MedicalRecordFactory.interface;

  const medRec = new Contract(contractAddress, abi, deployer); // ✅ FIXED

  const data = await medRec.getRecord(0); // ID pasien ke-0
  console.log("📄 Data Pasien:");
  console.log("Nama:", data.name);
  console.log("Tanggal Lahir:", data.birthDate);
  console.log("Diagnosa:", data.diagnosis);
  console.log("Perawatan:", data.treatment);
  console.log("Rumah Sakit:", data.hospital);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
