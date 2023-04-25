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
import Login from './pages/Login/Login';
import Visualize from './pages/Visualize/Visualize';

function App() {
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
      const res = await axios.get("http://localhost:5001/airports");
      setAirports(res.data.result);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAirlines = async () => {
      try {
      const res = await axios.get("http://localhost:5001/airlines");
      setAirlines(res.data.result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAirports();
    fetchAirlines();
  }, [])

  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/search" element={<Search airports={airports}/>} />
          <Route path="/" element={<Search airports={airports}/>} />
          <Route path="/analyze" element={<Analyze airports={airports}/>} />
          <Route path="/report" element={<Report airports={airports} airlines={airlines}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/visualize" element={<Visualize />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
