// src/pages/ItemListing.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const ItemListing = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const allItems = [];

    for (const key in localStorage) {
      if (key.startsWith('uploads_')) {
        try {
          const userItems = JSON.parse(localStorage.getItem(key)) || [];
          const email = key.split('uploads_')[1];

          userItems.forEach(item => {
            allItems.push({ ...item, lister: email });
          });
        } catch (err) {
          console.error(`Failed to parse ${key}:`, err);
        }
      }
    }

    setItems(allItems);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br py-20 from-green-50 via-emerald-100 to-green-200 px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-emerald-900">Browse Available Items</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.timestamp + item.title}
              to={`/item/${item.timestamp}`}
              state={{ item }}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <ProductCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-emerald-700 mt-20">No items available at the moment.</p>
      )}
    </div>
  );
};

export default ItemListing;
