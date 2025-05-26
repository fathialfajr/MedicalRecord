const hre = require("hardhat");

async function main() {
  const MedicalRecord = await hre.ethers.getContractFactory("MedicalRecord");
  const medicalRecord = await MedicalRecord.deploy();
  await medicalRecord.waitForDeployment();

  const address = await medicalRecord.getAddress();
  console.log(`✅ MedicalRecord deployed to: ${address}`);

  // ✅ Register your MetaMask hospital address here (replace this)
  const HOSPITAL_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const tx = await medicalRecord.registerHospital(HOSPITAL_ADDRESS, "Hardhat General Hospital");
  await tx.wait();

  console.log("✅ Hospital registered.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
