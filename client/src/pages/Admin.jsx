import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [pendingItems, setPendingItems] = useState([]);

  useEffect(() => {
    // TODO: API call for pending approvals
    setPendingItems([
      { id: 1, title: "Woolen Cap", category: "Accessories", imageUrl: "https://source.unsplash.com/featured/?cap" },
    ]);
  }, []);

  const handleApprove = (id) => {
    console.log("Approving", id);
    // Call API to approve
  };

  const handleReject = (id) => {
    console.log("Rejecting", id);
    // Call API to reject
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Pending Approvals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pendingItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img src={item.imageUrl} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.category}</p>
            <div className="mt-3 flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleApprove(item.id)}>Approve</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleReject(item.id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
