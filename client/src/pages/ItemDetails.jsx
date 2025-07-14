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
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4 py-10 text-gray-800">
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Image Section */}
      <div className="flex flex-col items-center">
        <img
          src={item.image_url || '/placeholder.jpg'}
          alt={item.title}
          className="w-full h-[350px] object-cover rounded-md border"
        />
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Listed on:</strong> {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</p>
          <p><strong>Listed by:</strong> {item.username}</p>
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-emerald-800">{item.title}</h1>
        <p className="text-gray-700 text-base">{item.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Size:</strong> {item.size}</p>
          <p><strong>Condition:</strong> {item.condition}</p>
        </div>

        {/* Tags */}
        {item.tags && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.split(',').map((tag, i) => (
              <span
                key={i}
                className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {swapMsg && <div className="text-green-600 text-center font-medium my-2">{swapMsg}</div>}

        {localStorage.getItem('token') &&
        item.username !== (JSON.parse(localStorage.getItem('user'))?.username) ? (
          <button
            onClick={handleSwapRequest}
            className="mt-6 w-full md:w-auto bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700"
          >
            Send Swap Request
          </button>
        ) : (
          <p className="mt-6 text-gray-500 italic text-sm">This is your item.</p>
        )}
      </div>
    </div>
  </div>
);

};

export default ItemDetails;
