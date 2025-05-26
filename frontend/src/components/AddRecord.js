import React, { useState } from "react";
import { getMedicalRecordContract } from "../utils/contract"; 

const AddRecord = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    diagnosis: "",
    treatment: "",
  });
  const [newRecordId, setNewRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNewRecordId(null);
    setError("");
    try {
      const contract = await getMedicalRecordContract();
      if (!contract) {
        setError("Koneksi ke kontrak gagal. Pastikan Metamask terhubung dan alamat kontrak benar.");
        setLoading(false);
        return;
      }
  
      const tx = await contract.addRecord(
        formData.name,
        formData.birthDate,
        formData.diagnosis,
        formData.treatment
      );
  
      const receipt = await tx.wait();
      let recordIdFromEvent = null;
      if (receipt.logs) {
          for (const log of receipt.logs) {
              try {
                  const parsedLog = contract.interface.parseLog(log);
                  if (parsedLog && parsedLog.name === "RecordAdded") {
                      recordIdFromEvent = parsedLog.args.recordId.toString();
                      break;
                  }
              } catch (e) {
              
              }
          }
      }

      if (recordIdFromEvent) {
        setNewRecordId(recordIdFromEvent);
        alert(`✅ Rekam medis berhasil ditambahkan! ID: ${recordIdFromEvent}`);
      } else {
        alert("✅ Rekam medis berhasil ditambahkan! Namun ID tidak dapat diambil dari event.");
      }
      
      setFormData({ 
        name: "",
        birthDate: "",
        diagnosis: "",
        treatment: "",
      });
    } catch (err) {
      console.error("❌ Gagal menambahkan rekam medis:", err);
      if (err.message.includes("Hospital not authorized")) {
        setError("⚠️ Gagal: Akun ini bukan rumah sakit terotorisasi. Silakan otorisasi akun ini melalui halaman manajemen rumah sakit.");
      } else {
        setError("⚠️ Ada yang salah. Silakan cek konsol untuk detailnya.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container-centered">
      <div className="card">
        <h2>📝 Tambah Rekam Medis</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Nama Pasien</label>
            <input
              id="patientName"
              className="form-control"
              type="text"
              name="name"
              placeholder="Nama Pasien"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Tanggal Lahir</label>
            <input
              id="birthDate"
              className="form-control"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <input
              id="diagnosis"
              className="form-control"
              type="text"
              name="diagnosis"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="treatment">Perawatan</label>
            <input
              id="treatment"
              className="form-control"
              type="text"
              name="treatment"
              placeholder="Perawatan"
              value={formData.treatment}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Menambahkan..." : "➕ Submit"}
          </button>
        </form>

        {newRecordId && (
          <div className="alert-success">
            Rekam medis berhasil ditambahkan! ID Rekam Medis Anda adalah: <strong>{newRecordId}</strong>.
            <p>Anda dapat mencari rekam medis ini di halaman "Cari Rekam Medis" menggunakan ID ini.</p>
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}
      </div>
    </div>
  );
};

export default AddRecord;