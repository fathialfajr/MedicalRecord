import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddRecord from "./components/AddRecord";
import ViewRecord from "./components/ViewRecord"; 
import ViewAllRecords from "./components/ViewAllRecords";
import HospitalManagement from "./components/HospitalManagement"; 
import "./App.css"; 

const HomePage = () => (
  <div className="container-centered">
    <div className="card">
      <h2>Selamat Datang di Medical Record Blockchain</h2>
      <p style={{textAlign: 'center', color: 'var(--light-text-color)'}}>
        Sistem Rekam Medis desentralisasi yang aman dan transparan, 
        memastikan integritas data pasien dan memfasilitasi pertukaran 
        informasi antar rumah sakit tanpa biaya tambahan.
      </p>
      <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
        <Link to="/add-record" className="btn-primary" style={{width: 'auto'}}>Tambah Rekam Medis</Link>
        <Link to="/view-all" className="btn-primary" style={{width: 'auto', backgroundColor: 'var(--secondary-color)'}}>Lihat Rekam Medis</Link>
      </div>
    </div>
  </div>
);

const Header = () => (
  <header style={{ 
    backgroundColor: 'var(--primary-color)', 
    padding: '1rem 2rem', 
    boxShadow: '0 4px 12px var(--shadow-medium)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <h1 style={{ margin: 0, color: 'white', fontSize: '1.8rem' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Medical Record</Link>
    </h1>
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <Link to="/add-record" className="nav-link">Tambah Rekam Medis</Link>
      <Link to="/view-all" className="nav-link">Lihat Semua</Link>
      <Link to="/view-single" className="nav-link">Cari Rekam Medis</Link>
      <Link to="/hospital-management" className="nav-link">Manajemen RS</Link>
    </nav>
  </header>
);

const Footer = () => (
  <footer style={{ 
    backgroundColor: '#333', 
    color: 'white', 
    textAlign: 'center', 
    padding: '1rem 2rem', 
    marginTop: 'auto', 
    boxShadow: '0 -2px 8px var(--shadow-medium)'
  }}>
    <p>&copy; {new Date().getFullYear()} Medical Record Blockchain DApp. All rights reserved.</p>
  </footer>
);


function App() {
  return (
    <Router>
      <Header />
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* Main content area */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home Page baru */}
          <Route path="/add-record" element={<AddRecord />} />
          <Route path="/view-all" element={<ViewAllRecords />} />
          <Route path="/view-single" element={<ViewRecord />} />
          <Route path="/hospital-management" element={<HospitalManagement />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}


const appStyles = {
  
};

export default App;