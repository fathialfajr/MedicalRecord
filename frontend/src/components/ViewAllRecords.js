import React, { useState, useEffect } from "react";
// Perhatikan perubahan path import di bawah ini
import { getMedicalRecordContract, getProvider, fetchAllRecords } from "../utils/contract"; 

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
        if (!contract) {
          setError("Koneksi ke kontrak gagal. Pastikan Metamask terhubung dan alamat kontrak benar.");
          setIsAuthorized(false); 
          return;
        }

        const provider = await getProvider();
        if (!provider) {
          setError("Provider tidak tersedia. Pastikan Metamask terpasang.");
          setIsAuthorized(false);
          return;
        }
        
        const accounts = await provider.listAccounts();
        const connectedAddress = accounts.length > 0 ? accounts[0].address : null;
        setAddress(connectedAddress);

        if (connectedAddress) {
            const info = await contract.getHospitalInfo(connectedAddress);
            const authorized = info[1]; 
            const name = info[0];

            if (!authorized) {
                setIsAuthorized(false);
                setHospitalName(null);
                return;
            }

            setIsAuthorized(true);
            setHospitalName(name);
        } else {
            setIsAuthorized(false); 
            setError("Tidak ada akun Metamask yang terhubung.");
            return;
        }

        const all = await fetchAllRecords(); 
        setRecords(all);
      } catch (err) {
        console.error("❌ Error loading records:", err);
        setError("⚠️ Gagal memuat rekam medis. Periksa konsol untuk detailnya.");
        setIsAuthorized(false); 
      }
    };

    loadRecords();
  }, []);

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (isAuthorized === null) {
    return <p className="message-info">⏳ Memeriksa akses...</p>;
  }

  if (!isAuthorized) {
    return (
      <div className="alert-error">
        <p>🚫 Akses ditolak: Dompet ini bukan rumah sakit terverifikasi.</p>
        <p>Alamat terhubung: {address}</p>
        <p>Jika Anda adalah pemilik kontrak, daftarkan rumah sakit ini di halaman Manajemen Rumah Sakit.</p>
      </div>
    );
  }

  return (
    <div style={{padding: '2rem'}}> {/* Padding tambahan untuk konten utama */}
      <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>📋 Semua Rekam Medis</h2>
      {isAuthorized && hospitalName && (
        <p className="message-info" style={{marginBottom: '2rem'}}>
          🏥 Masuk sebagai: <strong>{hospitalName}</strong> ({address})
        </p>
      )}

      {records.length === 0 ? (
        <p style={{ textAlign: "center", color: 'var(--light-text-color)' }}>Belum ada rekam medis ditemukan.</p>
      ) : (
        <div className="records-grid">
          {records.map((r, idx) => ( 
            <div key={idx} className="record-card">
              <p><strong>ID Rekam Medis:</strong> {idx}</p> 
              <p><strong>Pasien:</strong> {r.name}</p>
              <p><strong>Tgl Lahir:</strong> {r.birthDate}</p>
              <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
              <p><strong>Perawatan:</strong> {r.treatment}</p>
              <p><strong>Rumah Sakit:</strong> {r.hospital}</p>
              <p><strong>Waktu:</strong> {new Date(Number(r.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllRecords;