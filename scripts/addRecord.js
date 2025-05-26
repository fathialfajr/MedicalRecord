const hre = require("hardhat");
const { Contract } = require("ethers");

async function main() {
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // ganti dengan alamat kontrak hasil deploy
  const [deployer] = await hre.ethers.getSigners();

  const MedicalRecordFactory = await hre.ethers.getContractFactory("MedicalRecord");
  const abi = MedicalRecordFactory.interface;

  const medRec = new Contract(contractAddress, abi, deployer); // ✅ THIS is the working way

  const tx = await medRec.addRecord(
    "Budi Santoso",
    "1985-06-12",
    "Demam Berdarah",
    "Rawat inap + Transfusi"
  );
  await tx.wait();

  console.log("✅ Data pasien ditambahkan.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
