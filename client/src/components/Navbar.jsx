// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  async function getUser() {
    if (token) {
      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    getUser();
  },[token]);

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/60 backdrop-blur-lg border-b border-white/30 shadow-md transition-all duration-300 mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-2 md:py-3 flex justify-between items-center text-black-500">
        {/* LOGO + BRAND NAME */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png" // Make sure the image is placed in your public folder with this name
            alt="ReWear Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            Re<span className="text-emerald-600">Wear</span>
          </h1>
        </Link>

        {/* NAV LINKS */}
        <div className="space-x-4 sm:space-x-6 text-sm sm:text-base font-medium flex items-center">
          <Link to="/" className="hover:text-emerald-600">
            Home
          </Link>
          <Link to="/items" className="hover:text-emerald-600">
            Browse
          </Link>

          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Admin
            </Link>
          )}

          {currentUser ? (
            <>
              <Link to="/upload" className="hover:text-emerald-600">
                Upload
              </Link>
              <Link to="/dashboard" className="hover:text-emerald-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
              >
                Login
              </Link>
              <Link to="/register" className="text-emerald-700 hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
