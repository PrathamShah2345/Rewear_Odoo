import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router-dom';
import { getItems } from '../services/api';

// Demo Data to display initially if no backend data or while loading
const DEMO_ITEMS = [
  { id: 101, title: "Minimalist Trench Coat", category: "Women", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop", condition: "Like New", points: 120 },
  { id: 102, title: "Vintage Leather Satchel", category: "Accessories", image_url: "https://images.unsplash.com/photo-1590874102987-fdaef7d57a85?q=80&w=2080&auto=format&fit=crop", condition: "Gently Used", points: 85 },
  { id: 103, title: "Oversized Denim Jacket", category: "Men", image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop", condition: "New", points: 200 },
  { id: 104, title: "Ceramic Vase", category: "Home", image_url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1974&auto=format&fit=crop", condition: "New", points: 150 },
  { id: 105, title: "Classic White Tee", category: "Women", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop", condition: "New", points: 40 },
  { id: 106, title: "Leather Boots", category: "Men", image_url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1974&auto=format&fit=crop", condition: "Worn", points: 90 },
];

const ItemListing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        let displayItems = data;

        // If no items from backend, show demo items (for first impression)
        if (!data || data.length === 0) {
          displayItems = DEMO_ITEMS;
        } else {
          // mix in demo items if very few real items? Optional. 
          // For now, let's append demo items if less than 4 real items so the grid looks good
          if (data.length < 4) {
            displayItems = [...data, ...DEMO_ITEMS];
          }
        }

        const filtered = categoryFilter
          ? displayItems.filter(i => i.category === categoryFilter)
          : displayItems;

        setItems(filtered || []);
      } catch (err) {
        // Fallback to demo items on error
        const filtered = categoryFilter
          ? DEMO_ITEMS.filter(i => i.category === categoryFilter)
          : DEMO_ITEMS;
        setItems(filtered);
      }
      setLoading(false);
    };
    fetchItems();
  }, [categoryFilter]);

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Header */}
      <div className="px-6 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
            {categoryFilter ? `${categoryFilter}'s Collection` : 'All Items'}
          </h1>
          <p className="text-gray-500 text-sm">{items.length} Products Available</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading collection...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {items.map((item) => (
              <div key={item.id} className="cursor-pointer">
                {/* For real items, link to Details. Demo items link too but might fail if ID not in DB */}
                <Link to={`/item/${item.id}`}><ProductCard item={item} /></Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-medium mb-4">No items found.</p>
            <Link to="/" className="underline hover:text-gray-600">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemListing;
