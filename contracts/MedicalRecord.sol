// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Record {
        string name;
        string birthDate;
        string diagnosis;
        string treatment;
        string hospital;
    }

    address public owner;
    uint256 public nextId;

    mapping(uint256 => Record) private records;           // ID Pasien => Rekam medis
    mapping(address => bool) public authorizedHospitals; // Rumah sakit yang diizinkan

    modifier onlyOwner() {
        require(msg.sender == owner, "Bukan owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedHospitals[msg.sender], "Rumah sakit tidak diizinkan");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedHospitals[msg.sender] = true; // Rumah sakit pertama (admin) langsung diizinkan
    }

    function authorizeHospital(address _hospital) external onlyOwner {
        authorizedHospitals[_hospital] = true;
    }

    function revokeHospital(address _hospital) external onlyOwner {
        authorizedHospitals[_hospital] = false;
    }

    function addRecord(
        string memory _name,
        string memory _birthDate,
        string memory _diagnosis,
        string memory _treatment
    ) public onlyAuthorized {
        records[nextId] = Record({
            name: _name,
            birthDate: _birthDate,
            diagnosis: _diagnosis,
            treatment: _treatment,
            hospital: _getHospitalName(msg.sender)
        });
        nextId++;
    }

    function getRecord(uint256 _id) public view onlyAuthorized returns (Record memory) {
        return records[_id];
    }

    // Dummy untuk demo. Bisa diupgrade ke mapping address => nama RS.
    function _getHospitalName(address hospitalAddress) internal pure returns (string memory) {
        if (hospitalAddress == 0x0000000000000000000000000000000000000001) return "RS A";
        if (hospitalAddress == 0x0000000000000000000000000000000000000002) return "RS B";
        return "RS Tidak Diketahui";
    }
}
