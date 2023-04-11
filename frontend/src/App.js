import './App.css';
import Search from './pages/Search/Search';
import Analyze from './pages/Analyze/Analyze';
import Report from './pages/Report/Report';
import Navbar from './components/Navbar/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const res = await axios.get("http://localhost:5001/airports");
      setAirports(res.data.result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [])

  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/search" element={<Search airports={airports}/>} />
          <Route path="/" element={<Search airports={airports}/>} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
