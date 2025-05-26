import React, { useState, useEffect } from "react";

import { getMedicalRecordContract, getProvider } from "../utils/contract"; 

const HospitalManagement = () => {
  const [contractOwner, setContractOwner] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hospitalAddress, setHospitalAddress] = useState(""); 
  const [hospitalName, setHospitalName] = useState("");     
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [lookupAddress, setLookupAddress] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const contract = await getMedicalRecordContract();
        if (!contract) {
          setError("Koneksi ke kontrak gagal. Pastikan Metamask terhubung dan alamat kontrak benar.");
          setLoading(false);
          return;
        }

        const provider = await getProvider();
        if (!provider) {
          setError("Provider tidak tersedia. Pastikan Metamask terpasang.");
          setLoading(false);
          return;
        }

        const accounts = await provider.listAccounts();
        const connectedAccount = accounts.length > 0 ? accounts[0].address : null;
        setCurrentAccount(connectedAccount);

        const ownerAddress = await contract.owner();
        setContractOwner(ownerAddress);
        setIsOwner(connectedAccount && connectedAccount.toLowerCase() === ownerAddress.toLowerCase());

        setLoading(false);
      } catch (err) {
        console.error("Error initializing Hospital Management:", err);
        setError("Gagal memuat manajemen rumah sakit. Cek konsol.");
        setLoading(false);
      }
    };

    init();
  }, [refreshTrigger]); 

  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const contract = await getMedicalRecordContract();
      if (!contract) return;

      if (!isOwner) {
        alert("Hanya pemilik kontrak yang dapat mendaftarkan rumah sakit.");
        return;
      }

      const tx = await contract.registerHospital(hospitalAddress, hospitalName);
      await tx.wait();
      alert(`✅ Rumah sakit ${hospitalName} (${hospitalAddress}) berhasil didaftarkan!`);
      setHospitalAddress(""); 
      setHospitalName("");     
      setRefreshTrigger(prev => prev + 1); 
    } catch (err) {
      console.error("❌ Gagal mendaftarkan rumah sakit:", err);
      if (err.message.includes("Hospital already registered")) {
          setError("⚠️ Gagal mendaftarkan rumah sakit: Alamat ini sudah terdaftar dan terotorisasi.");
      } else {
          setError("⚠️ Gagal mendaftarkan rumah sakit. Pastikan alamat dan nama valid, dan Anda adalah pemilik kontrak.");
      }
    }
  };

  const handleRevokeHospital = async (addressToRevoke) => {
    setError("");
    try {
      const contract = await getMedicalRecordContract();
      if (!contract) return;

      if (!isOwner) {
        alert("Hanya pemilik kontrak yang dapat mencabut izin rumah sakit.");
        return;
      }

      const tx = await contract.revokeHospital(addressToRevoke);
      await tx.wait();
      alert(`✅ Izin rumah sakit ${addressToRevoke} berhasil dicabut!`);
      setRefreshTrigger(prev => prev + 1); 
      setLookupResult(null); 
    } catch (err) {
      console.error("❌ Gagal mencabut izin rumah sakit:", err);
      setError("⚠️ Gagal mencabut izin rumah sakit. Pastikan alamat valid dan Anda adalah pemilik kontrak.");
    }
  };

  const getHospitalDetails = async (address) => {
    try {
      const contract = await getMedicalRecordContract();
      if (!contract) return null;
      const info = await contract.getHospitalInfo(address);
      return {
        address: address,
        name: info[0],
        isAuthorized: info[1],
        registrationDate: new Date(Number(info[2]) * 1000).toLocaleString()
      };
    } catch (err) {
      console.error("Error fetching hospital details:", err);
      return null;
    }
  };

  const handleLookupHospital = async (e) => {
    e.preventDefault();
    setLookupResult(null);
    setLookupError("");
    try {
      const details = await getHospitalDetails(lookupAddress);
      if (details) {
        setLookupResult(details);
      } else {
        setLookupError("Gagal menemukan informasi rumah sakit atau alamat tidak valid.");
      }
    } catch (err) {
      setLookupError("Terjadi kesalahan saat mencari informasi rumah sakit.");
      console.error(err);
    }
  };

  if (loading) {
    return <p className="message-info">⏳ Memuat manajemen rumah sakit...</p>;
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div className="container-centered">
      <div className="card">
        <h2>🏥 Manajemen Rumah Sakit (Hanya Pemilik)</h2>
        <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--light-text-color)" }}>
          Akun Terhubung: <strong>{currentAccount}</strong> <br />
          Pemilik Kontrak: <strong>{contractOwner}</strong>
        </p>

        {isOwner ? (
          <>
            <div className="form-section" style={{marginBottom: '2rem'}}> {/* Styling khusus untuk section form */}
              <h3>Mendaftar Rumah Sakit Baru</h3>
              <form onSubmit={handleRegisterHospital}>
                <div className="form-group">
                  <label htmlFor="newHospitalAddress">Alamat Wallet Rumah Sakit</label>
                  <input
                    id="newHospitalAddress"
                    className="form-control"
                    type="text"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newHospitalName">Nama Rumah Sakit</label>
                  <input
                    id="newHospitalName"
                    className="form-control"
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="Nama Rumah Sakit"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Daftarkan Rumah Sakit
                </button>
              </form>
            </div>

            <div className="form-section"> {/* Styling khusus untuk section form */}
              <h3>Cari & Kelola Rumah Sakit</h3>
              <form onSubmit={handleLookupHospital}>
                <div className="form-group">
                  <label htmlFor="lookupAddress">Alamat Rumah Sakit yang dicari</label>
                  <input
                    id="lookupAddress"
                    className="form-control"
                    type="text"
                    value={lookupAddress}
                    onChange={(e) => setLookupAddress(e.target.value)}
                    placeholder="Masukkan alamat..."
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Cari Info Rumah Sakit
                </button>
              </form>

              {lookupError && <div className="alert-error">{lookupError}</div>}

              {lookupResult && (
                <div className="record-card" style={{marginTop: '1.5rem'}}> {/* Menggunakan style card untuk tampilan info */}
                  <h4>Info Rumah Sakit:</h4>
                  <p><strong>Alamat:</strong> {lookupResult.address}</p>
                  <p><strong>Nama:</strong> {lookupResult.name}</p>
                  <p><strong>Terotorisasi:</strong> {lookupResult.isAuthorized ? "✅ Ya" : "❌ Tidak"}</p>
                  {lookupResult.isAuthorized && <p><strong>Tanggal Pendaftaran:</strong> {lookupResult.registrationDate}</p>}
                  
                  {lookupResult.isAuthorized ? (
                    <button 
                      className="btn-danger"
                      onClick={() => handleRevokeHospital(lookupResult.address)}
                    >
                      Cabut Izin
                    </button>
                  ) : (
                    <button 
                      className="btn-success"
                      onClick={() => {
                          setHospitalAddress(lookupResult.address);
                          setHospitalName(lookupResult.name);
                          alert('Alamat dan nama rumah sakit telah dimuat ke form "Mendaftar Rumah Sakit Baru" di atas. Silakan klik "Daftarkan Rumah Sakit" di form tersebut untuk mendaftarkan ulang.');
                      }}
                    >
                      Daftarkan Ulang (Isi Form di Atas)
                    </button>
                  )}
                </div>
              )}
            </div>
            <p style={{marginTop: '2rem', fontStyle: 'italic', color: 'var(--light-text-color)', textAlign: 'center'}}>
              Catatan: Kontrak saat ini tidak memiliki fungsi untuk menampilkan semua alamat rumah sakit yang terdaftar. 
              Anda harus mencari informasi rumah sakit satu per satu menggunakan alamatnya.
            </p>
          </>
        ) : (
          <p className="alert-error" style={{textAlign: 'center'}}>
            🚫 Akses ditolak: Anda bukan pemilik kontrak.
          </p>
        )}
      </div>
    </div>
  );
};

export default HospitalManagement;