import React, { useEffect, useState } from "react";
import { fetchAllRecords } from "../utils/contract";

function ViewAllRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchAllRecords();
        setRecords(data);
      } catch (err) {
        console.error("❌ Failed to load records:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 All Medical Records</h2>
      {loading ? (
        <p>⏳ Loading...</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {records.map((r, idx) => (
            <li key={idx} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <strong>Name:</strong> {r.name}<br />
              <strong>Birth Date:</strong> {r.birthDate}<br />
              <strong>Diagnosis:</strong> {r.diagnosis}<br />
              <strong>Treatment:</strong> {r.treatment}<br />
              <strong>Hospital:</strong> {r.hospital}<br />
              <strong>Time:</strong> {new Date(Number(r.timestamp) * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewAllRecords;
