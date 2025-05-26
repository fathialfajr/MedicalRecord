import React, { useState } from "react";
import { getMedicalRecordContract } from "../utils/contract";

const ViewRecord = () => {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setRecordId(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setRecord(null);
    setError("");
    setLoading(true);
    try {
      const contract = await getMedicalRecordContract();
      if (!contract) {
        setError("Koneksi ke kontrak gagal. Pastikan Metamask terhubung dan alamat kontrak benar.");
        setLoading(false);
        return;
      }

      const fetchedRecord = await contract.getRecord(recordId);
      if (fetchedRecord.name === "") { 
        setError("Rekam medis dengan ID tersebut tidak ditemukan.");
        setRecord(null);
      } else {
        setRecord({
          name: fetchedRecord.name,
          birthDate: fetchedRecord.birthDate,
          diagnosis: fetchedRecord.diagnosis,
          treatment: fetchedRecord.treatment,
          hospital: fetchedRecord.hospital,
          timestamp: new Date(Number(fetchedRecord.timestamp) * 1000).toLocaleString(),
        });
      }
    } catch (err) {
      console.error("❌ Gagal mendapatkan rekam medis:", err);
      setError("⚠️ Gagal memuat rekam medis. ID mungkin tidak valid atau ada masalah koneksi.");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-centered">
      <div className="card">
        <h2>🔍 Cari Rekam Medis Berdasarkan ID</h2>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="recordId">ID Rekam Medis</label>
            <input
              id="recordId"
              className="form-control"
              type="number"
              name="recordId"
              placeholder="Masukkan ID Rekam Medis"
              value={recordId}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Mencari..." : "Cari"}
          </button>
        </form>

        {error && <div className="alert-error">{error}</div>}

        {record && (
          <div className="record-card" style={{marginTop: '1.5rem'}}>
            <h4>Detail Rekam Medis:</h4>
            <p><strong>Pasien:</strong> {record.name}</p>
            <p><strong>Tgl Lahir:</strong> {record.birthDate}</p>
            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
            <p><strong>Perawatan:</strong> {record.treatment}</p>
            <p><strong>Rumah Sakit:</strong> {record.hospital}</p>
            <p><strong>Waktu:</strong> {record.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecord;