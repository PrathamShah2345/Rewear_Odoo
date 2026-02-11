// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiShoppingBag, FiMenu } from "react-icons/fi"; // Need to install react-icons if not present

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
  }, [token]);

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center space-x-4">
            <button className="text-black md:hidden">
              <FiMenu className="w-6 h-6" />
            </button>
            <button className="text-black hidden md:block">
              <FiSearch className="w-5 h-5 hover:text-gray-600 transition" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center">
              <span className="text-2xl font-bold tracking-tighter uppercase">ReWear</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 -mt-1">Design Store</span>
            </Link>
          </div>

          {/* Right: User & Actions */}
          <div className="flex items-center space-x-6 text-sm font-medium">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/items" className="hover:underline underline-offset-4">Shop</Link>
              <Link to="/upload" className="hover:underline underline-offset-4">Sell</Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" className="text-red-600 hover:underline underline-offset-4">Admin</Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative group">
                  <Link to="/dashboard" className="flex items-center text-black hover:text-gray-600">
                    {currentUser.profile_image ? (
                      <img src={currentUser.profile_image} alt="User" className="w-6 h-6 rounded-full object-cover border border-gray-300" />
                    ) : (
                      <FiUser className="w-5 h-5" />
                    )}
                  </Link>
                  {/* Dropdown for logout could go here, for now just dashboard click */}
                  <button onClick={handleLogout} className="hidden group-hover:block absolute right-0 top-full bg-white border p-2 text-xs w-20 shadow-lg">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="text-black hover:text-gray-600">
                  Login
                </Link>
              )}

              <Link to="/dashboard" className="text-black hover:text-gray-600 relative">
                <FiShoppingBag className="w-5 h-5" />
                {currentUser?.points > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {Math.min(currentUser.points, 99)}
                  </span>
                )}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
