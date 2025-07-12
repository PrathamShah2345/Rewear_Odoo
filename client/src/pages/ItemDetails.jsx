// src/pages/ItemDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allItems = [];
    for (const key in localStorage) {
      if (key.startsWith('uploads_')) {
        const email = key.split('uploads_')[1];
        const uploads = JSON.parse(localStorage.getItem(key)) || [];
        uploads.forEach((upload) => {
          allItems.push({ ...upload, lister: email });
        });
      }
    }
    const foundItem = allItems.find((i) => i.timestamp.toString() === id);
    setItem(foundItem);
    setLoading(false);
  }, [id]);

  const handleSwapRequest = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || !item) return;

    const swapKey = `swap_requests_${item.lister}`;
    const existing = JSON.parse(localStorage.getItem(swapKey)) || [];

    const newRequest = {
      id: Date.now(),
      from: currentUser.email,
      itemTitle: item.title,
      status: 'Pending',
    };

    localStorage.setItem(swapKey, JSON.stringify([...existing, newRequest]));
    alert('Swap request sent!');
    navigate('/items');
  };

  if (loading) return <p className="text-center mt-20">Loading item details...</p>;
  if (!item) return <p className="text-center mt-20">Item not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-6 py-10 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold text-emerald-800 mb-2">{item.title}</h1>
        <p><strong>Size:</strong> {item.size || 'M'}</p>
        <p><strong>Condition:</strong> {item.condition || 'Gently Used'}</p>
        <p><strong>Type:</strong> {item.type || 'Casual'}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Description:</strong> {item.description || 'No description provided.'}</p>
        <p><strong>Listed by:</strong> {item.lister}</p>
        <p><strong>Posted on:</strong> {new Date(item.timestamp).toLocaleString()}</p>

        {JSON.parse(localStorage.getItem('user'))?.email !== item.lister ? (
          <button
            onClick={handleSwapRequest}
            className="mt-6 w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Send Swap Request
          </button>
        ) : (
          <p className="mt-4 text-gray-500 italic text-sm">This is your item.</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
