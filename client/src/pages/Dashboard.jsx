// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getItemsByUsername, getMySwaps, respondToSwap, getCurrentUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        const items = await getItemsByUsername(user.username);
        setMyItems(items || []);

        const swaps = await getMySwaps(token);
        setSwapRequests(swaps?.received || []);
        setSentRequests(swaps?.sent || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [token, navigate]);

  const handleAccept = async (id) => {
    const result = await respondToSwap(id, "accepted", token);
    if (result.msg) {
      const user = await getCurrentUser(token);
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
    setSwapRequests(
      swapRequests.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
    );
  };

  const handleReject = async (id) => {
    await respondToSwap(id, "rejected", token);
    setSwapRequests(
      swapRequests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-medium">Loading...</div>;
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Header Profile Section */}
      <div className="bg-[#F5F5F5] py-16 px-6 border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">

            {/* Profile Image with Upload */}
            <div className="relative group w-24 h-24 flex-shrink-0">
              <img
                src={currentUser.profile_image || "https://ui-avatars.com/api/?name=" + currentUser.username + "&background=000&color=fff"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border border-gray-300"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    // Upload
                    const cloudData = new FormData();
                    cloudData.append('file', file);
                    cloudData.append('upload_preset', 'rewear');
                    cloudData.append('cloud_name', 'dzbfhy0rz');

                    try {
                      const res = await fetch(`https://api.cloudinary.com/v1_1/dzbfhy0rz/image/upload`, { method: 'POST', body: cloudData });
                      const data = await res.json();
                      if (data.secure_url) {
                        const updated = await import("../services/api").then(mod => mod.updateProfile({ profile_image: data.secure_url }, token));
                        setCurrentUser(prev => ({ ...prev, profile_image: data.secure_url }));
                        localStorage.setItem("user", JSON.stringify({ ...currentUser, profile_image: data.secure_url }));
                      }
                    } catch (err) {
                      console.error("Profile upload failed", err);
                    }
                  }
                }} />
              </label>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">My Account</p>
              <h1 className="text-4xl font-bold uppercase tracking-tight">{currentUser.username}</h1>
              <div className="mt-4 flex gap-6 text-sm font-medium">
                <p>Email: <span className="text-gray-600 font-normal">{currentUser.email}</span></p>
                <p>Points: <span className="text-gray-600 font-normal">{currentUser.points}</span></p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-black px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Swaps Section - Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Incoming */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-4">Incoming Requests</h3>
            {swapRequests.length > 0 ? (
              <div className="space-y-6">
                {swapRequests.map((req) => (
                  <div key={req.id} className="border border-gray-200 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Request From</p>
                        <p className="font-bold">{req.requested_by?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase text-gray-500 tracking-wide">For Item</p>
                        <p className="font-bold">{req.item?.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`text-xs font-bold uppercase tracking-wider ${req.status === 'pending' ? 'text-yellow-600' :
                        req.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {req.status}
                      </span>

                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(req.id)} className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800">Accept</button>
                          <button onClick={() => handleReject(req.id)} className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No incoming requests.</p>
            )}
          </div>

          {/* Outgoing */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-4">Sent Requests</h3>
            {sentRequests.length > 0 ? (
              <div className="space-y-6">
                {sentRequests.map((req) => (
                  <div key={req.id} className="border border-gray-200 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">To</p>
                        <p className="font-bold">{req.requested_to?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Requested</p>
                        <p className="font-bold">{req.item?.title}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className={`text-xs font-bold uppercase tracking-wider ${req.status === 'pending' ? 'text-yellow-600' :
                        req.status === 'accepted' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                        Status: {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No sent requests.</p>
            )}
          </div>

        </div>

        {/* My Items */}
        <div>
          <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-4">My Collection</h3>
          {myItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {myItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">You haven't uploaded any items.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
