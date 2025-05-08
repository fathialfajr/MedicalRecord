const hre = require("hardhat");

async function main() {
  const MedicalRecord = await hre.ethers.getContractFactory("MedicalRecord");
  const medRec = await MedicalRecord.deploy(); // deploy kontrak
  await medRec.waitForDeployment(); // tunggu sampai deployment selesai

  console.log("✅ MedicalRecord deployed to:", await medRec.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
