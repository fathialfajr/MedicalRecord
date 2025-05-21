// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Record {
        string name;
        string birthDate;
        string diagnosis;
        string treatment;
        string hospital;
        uint256 timestamp;
    }

    struct Hospital {
        string name;
        bool isAuthorized;
        uint256 registrationDate;
    }

    address public owner;
    uint256 public nextId;

    mapping(uint256 => Record) private records;       // Patient ID => Medical Record
    mapping(address => Hospital) public hospitals;    // Address => Hospital Info

    // Events for better tracking and frontend integration
    event HospitalRegistered(address indexed hospital, string name, uint256 timestamp);
    event HospitalRevoked(address indexed hospital, uint256 timestamp);
    event RecordAdded(uint256 indexed recordId, string patientName, string hospital, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyAuthorized() {
        require(hospitals[msg.sender].isAuthorized, "Hospital not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerHospital(address _hospital, string memory _name) external onlyOwner {
        require(_hospital != address(0), "Invalid hospital address");
        require(bytes(_name).length > 0, "Hospital name cannot be empty");
        require(!hospitals[_hospital].isAuthorized, "Hospital already registered");
        
        hospitals[_hospital] = Hospital({
            name: _name,
            isAuthorized: true,
            registrationDate: block.timestamp
        });
        
        emit HospitalRegistered(_hospital, _name, block.timestamp);
    }

    function revokeHospital(address _hospital) external onlyOwner {
        require(hospitals[_hospital].isAuthorized, "Hospital not registered or already revoked");
        
        hospitals[_hospital].isAuthorized = false;
        
        emit HospitalRevoked(_hospital, block.timestamp);
    }

    function getHospitalInfo(address _hospital) external view returns (string memory name, bool authorized, uint256 registrationDate) {
        Hospital memory h = hospitals[_hospital];
        return (h.name, h.isAuthorized, h.registrationDate);
    }

    function addRecord(
        string memory name,
        string memory birthDate,
        string memory diagnosis,
        string memory treatment
    ) external onlyAuthorized returns (uint256) {
        require(bytes(name).length > 0, "Patient name cannot be empty");
        require(bytes(birthDate).length > 0, "Birth date cannot be empty");
        
        uint256 recordId = nextId;
        
        records[recordId] = Record({
            name: name,
            birthDate: birthDate,
            diagnosis: diagnosis,
            treatment: treatment,
            hospital: hospitals[msg.sender].name,
            timestamp: block.timestamp
        });
        
        emit RecordAdded(recordId, name, hospitals[msg.sender].name, block.timestamp);
        
        nextId++;
        return recordId;
    }

    function getRecord(uint256 id) external view returns (Record memory) {
        require(id < nextId, "Record does not exist");
        return records[id];
    }
    
    // For the owner to transfer ownership if needed
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    function getAllRecords() public view returns (Record[] memory) {
    Record[] memory all = new Record[](nextId);
    for (uint256 i = 0; i < nextId; i++) {
        all[i] = records[i];
    }
    return all;
    }


}