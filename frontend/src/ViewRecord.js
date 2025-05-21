import React, { useState } from "react";
import { getMedicalRecordContract } from "./utils/contract";

export default function ViewRecord() {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");

  const fetchRecord = async () => {
    try {
      const contract = await getMedicalRecordContract();
      const result = await contract.getRecord(parseInt(recordId));
      setRecord(result);
      setError("");
    } catch (err) {
      setError("❌ Record not found or error occurred.");
      setRecord(null);
      console.error(err);
    }
  };

  return (
    <div className="view-record-container">
      <h2>🔍 View Medical Record</h2>
      <input
        type="number"
        value={recordId}
        onChange={(e) => setRecordId(e.target.value)}
        placeholder="Enter record ID"
      />
      <button onClick={fetchRecord}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {record && (
        <div className="record-result">
          <p><strong>Name:</strong> {record.name}</p>
          <p><strong>Birth Date:</strong> {record.birthDate}</p>
          <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
          <p><strong>Treatment:</strong> {record.treatment}</p>
          <p><strong>Hospital:</strong> {record.hospital}</p>
          <p><strong>Timestamp:</strong> {new Date(Number(record.timestamp) * 1000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
