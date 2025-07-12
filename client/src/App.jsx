import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemListing from './pages/ItemListing';
import Upload from './pages/Upload';
import Admin from './pages/Admin';
import ItemDetails from './pages/ItemDetails.jsx';

import Navbar from './components/Navbar';

function App() {
  return (
 <Router>
      {/* ✅ Entire app must be inside Router */}
      <div className="min-h-screen bg-gradient-to-br from-[#f7f0ff] via-[#e0f7fa] to-[#ffe0f0] text-gray-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<ItemListing />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
