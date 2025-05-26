const hre = require("hardhat");

async function main() {
  // Load contract
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; 
  const MedicalRecord = await hre.ethers.getContractAt("MedicalRecord", contractAddress);
  
  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log("Registering hospitals using account:", deployer.address);
  
  // List of hospitals to register
  const hospitals = [
    {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
      name: "Rumah Sakit Sehat Sentosa"
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", 
      name: "Rumah Sakit Medika Prima"
    }
  ];
  
  // Register each hospital
  for (const hospital of hospitals) {
    console.log(`Attempting to register: ${hospital.name} (${hospital.address})`);
    
    try {
      // Check if hospital is already registered
      const info = await MedicalRecord.getHospitalInfo(hospital.address);
      
      if (info[1]) { // If already authorized
        console.log(`Hospital ${hospital.name} is already registered and authorized`);
        continue;
      }
      
      // Register the hospital
      const tx = await MedicalRecord.registerHospital(hospital.address, hospital.name);
      await tx.wait();
      console.log(`✅ Successfully registered hospital: ${hospital.name} (${hospital.address})`);
      
      // Verify registration was successful
      const updatedInfo = await MedicalRecord.getHospitalInfo(hospital.address);
      console.log(`Hospital status: Name=${updatedInfo[0]}, Authorized=${updatedInfo[1]}`);
      
    } catch (error) {
      console.error(`❌ Failed to register hospital ${hospital.name}:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });