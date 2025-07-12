// src/pages/ItemDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItems, requestSwap } from '../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swapMsg, setSwapMsg] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        // If you have a getItemById, use it. Otherwise, fetch all and filter:
        const items = await getItems();
        const found = items.find((i) => String(i.id) === String(id));
        setItem(found);
      } catch (err) {
        setError('Failed to load item.');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    const token = localStorage.getItem('token');
    if (!token || !item) return;
    try {
      const result = await requestSwap(item.id, token);
      setSwapMsg(result.msg || 'Swap request sent!');
      setTimeout(() => navigate('/items'), 1200);
    } catch (err) {
      setSwapMsg('Failed to send swap request.');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading item details...</p>;
  if (!item) return <p className="text-center mt-20">Item not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-6 py-10 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold text-emerald-800 mb-2">{item.title}</h1>
        <p><strong>Size:</strong> {item.size || 'M'}</p>
        <p><strong>Condition:</strong> {item.condition || 'Gently Used'}</p>
        <p><strong>Type:</strong> {item.type || 'Casual'}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Description:</strong> {item.description || 'No description provided.'}</p>
        <p><strong>Listed by:</strong> {item.username}</p>
        <p><strong>Posted on:</strong> {item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>

        {swapMsg && <div className="text-green-600 text-center my-2">{swapMsg}</div>}

        {localStorage.getItem('token') && item.username !== (JSON.parse(localStorage.getItem('user'))?.username) ? (
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
