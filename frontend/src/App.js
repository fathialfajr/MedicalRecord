import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddRecord from "./components/AddRecord";
import ViewRecord from "./ViewRecord";
import ViewAllRecords from "./components/ViewAllRecords";



function App() {
  return (
    <Router>
      {/* 🔽 Add nav here */}
      <nav style={{ padding: "10px", background: "#f0f0f0" }}>
        <a href="/" style={{ marginRight: "15px" }}>➕ Add Record</a>
        <a href="/view-all" style={{ marginRight: "15px" }}>📋 View All</a>

      </nav>

      <Routes>
        <Route path="/" element={<AddRecord />} />
        <Route path="/view" element={<ViewRecord />} />
        <Route path="/view-all" element={<ViewAllRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
