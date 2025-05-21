import React, { useState, useEffect } from "react";
import { getMedicalRecordContract } from "../utils/contract";

const ViewAllRecords = () => {
const [records, setRecords] = useState([]);
const [isAuthorized, setIsAuthorized] = useState(null); // null = loading
const [hospitalName, setHospitalName] = useState(null);
const [address, setAddress] = useState("");
const [error, setError] = useState("");


  useEffect(() => {
    const loadRecords = async () => {
      try {
        const contract = await getMedicalRecordContract();
        const address = await contract.runner.getAddress(); // connected wallet

        // 🔍 Check hospital authorization
        const info = await contract.getHospitalInfo(address);
        const authorized = info[1]; // true/false
        const name = info[0];

        setAddress(address);

        if (!authorized) {
          setIsAuthorized(false);
          setHospitalName(null);
          return;
        }

        setIsAuthorized(true);
        setHospitalName(name);

        // ✅ Fetch all records
        const all = await contract.getAllRecords();
        setRecords(all);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("⚠️ Failed to load records. Check console.");
      }
    };

    loadRecords();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (isAuthorized === null) {
    return <p>⏳ Checking access...</p>;
  }

  if (!isAuthorized) {
    return <p style={{ color: "darkred" }}>🚫 Access denied: This wallet is not a verified hospital.</p>;
  }

  return (
    <div>
      <h2>📋 All Medical Records</h2>
      {isAuthorized && hospitalName && (
        <p style={{ color: "green", marginBottom: "1rem" }}>
          🏥 Logged in as: <strong>{hospitalName}</strong> ({address})
        </p>
      )}

      {isAuthorized === false && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          ❌ Access denied. This wallet is not a verified hospital: {address}
        </p>
      )}

      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        records.map((r, idx) => (
          <div key={idx} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
            <p><strong>Patient:</strong> {r.name}</p>
            <p><strong>DOB:</strong> {r.birthDate}</p>
            <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
            <p><strong>Treatment:</strong> {r.treatment}</p>
            <p><strong>Hospital:</strong> {r.hospital}</p>
            <p><strong>Time:</strong> {new Date(Number(r.timestamp) * 1000).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewAllRecords;
