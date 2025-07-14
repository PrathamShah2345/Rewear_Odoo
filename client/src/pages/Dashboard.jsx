// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getItemsByUsername, getMySwaps, respondToSwap } from "../services/api";

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [myItems, setMyItems] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  
  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const items = await getItemsByUsername(currentUser.username);
        setMyItems(items || []);

        const swaps = await getMySwaps(token);
        setSwapRequests(swaps?.received || []);
        setSentRequests(swaps?.sent || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
    console.log("Dashboard data fetched successfully");
  }, [token]);

  const handleAccept = async (id) => {
    await respondToSwap(id, "accepted", token);
    setSwapRequests(
      swapRequests.map((r) => (r.id === id ? { ...r, status: "Accepted" } : r))
    );
  };

  const handleReject = async (id) => {
    await respondToSwap(id, "rejected", token);
    setSwapRequests(
      swapRequests.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
  };

  if (!token || !currentUser) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-20 from-green-50 via-emerald-100 to-green-200 px-6 md:px-12 text-gray-800">
      <h2 className="text-3xl font-extrabold mb-6 text-emerald-800">
        Welcome, {currentUser?.username}
      </h2>

      {/* Profile Details */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 mb-10 shadow">
        <h3 className="text-xl font-semibold mb-2">Profile & Points</h3>
        <p>
          <span className="font-semibold">Email:</span> {currentUser?.email}
        </p>
        <p>
          <span className="font-semibold">Points:</span> {currentUser?.points}
        </p>
      </div>

      {/* Uploaded Items */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4 text-emerald-700">
          My Uploaded Items
        </h3>
        {myItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myItems.map((item) => (
              <ProductCard key={item.id} item={item} editable />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You haven’t uploaded anything yet.
          </p>
        )}
      </div>

      {/* Incoming Swap Requests */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4 text-emerald-700">
          Incoming Swap Requests
        </h3>
        {swapRequests.length > 0 ? (
          <div className="space-y-4">
            {swapRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/80 p-4 rounded-xl shadow border"
              >
                <p>
                  <strong>From:</strong> {req.requested_by?.username}
                </p>
                <p>
                  <strong>For Item:</strong> {req.item?.title}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
                {req.status === "pending" && (
                  <div className="mt-2 space-x-3">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No swap requests received.
          </p>
        )}
      </div>

      {/* Outgoing Swap Requests */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-emerald-700">
          My Sent Swap Requests
        </h3>
        {sentRequests.length > 0 ? (
          <div className="space-y-4">
            {sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/80 p-4 rounded-xl shadow border"
              >
                <p>
                  <strong>To:</strong> {req.requested_to?.username}
                </p>
                <p>
                  <strong>For Item:</strong> {req.item?.title}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You haven’t sent any swap requests yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
