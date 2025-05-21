import React, { useState } from "react";
import { getMedicalRecordContract } from "../utils/contract";

const AddRecord = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    diagnosis: "",
    treatment: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📥 Form data:", formData); // ✅ LOG 1
  
      const contract = await getMedicalRecordContract();
      console.log("🔗 Contract object:", contract); // ✅ LOG 2
      console.log("📦 contract.addRecord:", contract?.addRecord); // ✅ LOG 3
  
      const tx = await contract.addRecord(
        formData.name,
        formData.birthDate,
        formData.diagnosis,
        formData.treatment
      );
  
      await tx.wait();
      alert("✅ Record added successfully!");
    } catch (err) {
      console.error("❌ Failed to add record:", err); // 🔍 This shows you the actual blockchain error
      alert("⚠️ Something went wrong.");
    }
  };
  

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>📝 Add Medical Record</h2>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="text"
          name="treatment"
          placeholder="Treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
        />

        <button type="submit" style={styles.button}>
          ➕ Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default AddRecord;
