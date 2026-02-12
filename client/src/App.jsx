import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemListing from './pages/ItemListing';
import Upload from './pages/Upload';
import Admin from './pages/Admin';
import ItemDetails from './pages/ItemDetails.jsx';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route guard component — redirects to /login if no token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const noNavOffset = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${noNavOffset ? "" : "pt-24"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/items" element={<ItemListing />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
