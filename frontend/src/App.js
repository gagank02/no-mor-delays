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

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Search />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
