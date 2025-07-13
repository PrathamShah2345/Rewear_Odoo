// src/pages/ItemListing.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { getItems } from '../services/api';

const ItemListing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch items from Flask API
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        setItems(data || []);
      } catch (err) {
        setItems([]);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen px-6 py-5 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-emerald-900">Available Items</h1>
      {loading ? (
        <p className="text-center text-emerald-700 mt-20">Loading items...</p>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
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
