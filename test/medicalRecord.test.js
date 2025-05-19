const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord Contract", function () {
  let MedicalRecord;
  let medicalRecord;
  let owner;
  let hospital1;
  let hospital2;
  let patient;

  beforeEach(async function () {
    // Get signers
    [owner, hospital1, hospital2, patient] = await ethers.getSigners();
    
    // Deploy contract
    MedicalRecord = await ethers.getContractFactory("MedicalRecord");
    medicalRecord = await MedicalRecord.deploy();
    //await medicalRecord.deployed();
  });

  describe("Hospital Authentication", function () {
    it("Should set deployer as owner", async function () {
      expect(await medicalRecord.owner()).to.equal(owner.address);
    });

    it("Should allow owner to register a hospital", async function () {
      const hospitalName = "Test Hospital";
      
      await medicalRecord.registerHospital(hospital1.address, hospitalName);
      
      const info = await medicalRecord.getHospitalInfo(hospital1.address);
      expect(info[0]).to.equal(hospitalName);
      expect(info[1]).to.equal(true);
    });
    
    it("Should not allow non-owner to register a hospital", async function () {
      await expect(
        medicalRecord.connect(hospital1).registerHospital(hospital2.address, "Fake Hospital")
      ).to.be.revertedWith("Not the owner");
    });

    it("Should not allow registering a hospital twice", async function () {
      await medicalRecord.registerHospital(hospital1.address, "First Registration");
      
      await expect(
        medicalRecord.registerHospital(hospital1.address, "Second Registration")
      ).to.be.revertedWith("Hospital already registered");
    });

    it("Should allow owner to revoke hospital authorization", async function () {
      // Register hospital
      await medicalRecord.registerHospital(hospital1.address, "Hospital to Revoke");
      
      // Verify it's registered
      let info = await medicalRecord.getHospitalInfo(hospital1.address);
      expect(info[1]).to.equal(true);
      
      // Revoke authorization
      await medicalRecord.revokeHospital(hospital1.address);
      
      // Verify it's revoked
      info = await medicalRecord.getHospitalInfo(hospital1.address);
      expect(info[1]).to.equal(false);
    });

    it("Should not allow non-owner to revoke hospital authorization", async function () {
      await medicalRecord.registerHospital(hospital1.address, "Secure Hospital");
      
      await expect(
        medicalRecord.connect(hospital2).revokeHospital(hospital1.address)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should not allow revoking an unregistered hospital", async function () {
      await expect(
        medicalRecord.revokeHospital(hospital1.address)
      ).to.be.revertedWith("Hospital not registered or already revoked");
    });
  });

  describe("Medical Records Management", function () {
    beforeEach(async function () {
      // Register hospital1 for testing
      await medicalRecord.registerHospital(hospital1.address, "Authorized Hospital");
    });

    it("Should allow authorized hospital to add a record", async function () {
      // Add a record from authorized hospital
      await medicalRecord.connect(hospital1).addRecord(
        "John Doe", 
        "1990-01-01", 
        "Common Cold", 
        "Rest and fluids"
      );
      
      // Get and verify the record
      const record = await medicalRecord.getRecord(0);
      expect(record.name).to.equal("John Doe");
      expect(record.birthDate).to.equal("1990-01-01");
      expect(record.diagnosis).to.equal("Common Cold");
      expect(record.treatment).to.equal("Rest and fluids");
      expect(record.hospital).to.equal("Authorized Hospital");
    });

    it("Should not allow unauthorized hospital to add a record", async function () {
      await expect(
        medicalRecord.connect(hospital2).addRecord(
          "Jane Smith", 
          "1985-05-15", 
          "Bronchitis", 
          "Antibiotics"
        )
      ).to.be.revertedWith("Hospital not authorized");
    });

    it("Should not allow revoked hospital to add records", async function () {
      // Register and then revoke hospital2
      await medicalRecord.registerHospital(hospital2.address, "Soon to be Revoked");
      await medicalRecord.revokeHospital(hospital2.address);
      
      // Try to add record from revoked hospital
      await expect(
        medicalRecord.connect(hospital2).addRecord(
          "Alex Johnson", 
          "1975-03-22", 
          "Hypertension", 
          "Medication and lifestyle changes"
        )
      ).to.be.revertedWith("Hospital not authorized");
    });
  });
});