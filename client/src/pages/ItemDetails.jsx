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
    <div className="min-h-screen py-30 bg-white px-6 py-10 text-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
          <img
            src={item.imageUrl || 'https://via.placeholder.com/600'}
            alt={item.title}
            className="w-full object-cover max-h-[600px]"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{item.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded">Available</span>
            <span className="bg-gray-200 text-gray-800 text-sm font-semibold px-2 py-1 rounded">{item.category || 'Outerwear'}</span>
          </div>
          <p className="mb-4 text-gray-700">{item.description || 'No description provided.'}</p>

          <div className="space-y-2 text-sm">
            <p><strong>Size:</strong> {item.size || 'M'}</p>
            <p><strong>Condition:</strong> {item.condition || 'Excellent'}</p>
            <p><strong>Type:</strong> {item.type || 'Swap'}</p>
            <p><strong>Category:</strong> {item.category || 'Outerwear'}</p>
          </div>

          <div className="mt-4 border-t pt-4">
            <p><strong>Listed by:</strong> {item.lister}</p>
            <p><strong>Posted on:</strong> {new Date(item.timestamp).toLocaleString()}</p>
          </div>

          {JSON.parse(localStorage.getItem('user'))?.email !== item.lister ? (
            <button
              onClick={handleSwapRequest}
              className="mt-6 w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Request Swap
            </button>
          ) : (
            <p className="mt-4 text-gray-500 italic text-sm">This is your item.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
