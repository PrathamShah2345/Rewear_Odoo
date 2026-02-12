import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router-dom';
import { getItems } from '../services/api';
import Squares from '../components/Squares';

// Demo Data to display initially if no backend data or while loading
const DEMO_ITEMS = [
  { id: 101, title: "Minimalist Trench Coat", category: "Women", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop", condition: "Like New", price: 85, points: 120 },
  { id: 102, title: "Vintage Leather Satchel", category: "Accessories", image_url: "https://images.unsplash.com/photo-1590874102987-fdaef7d57a85?q=80&w=2080&auto=format&fit=crop", condition: "Gently Used", price: 120, points: 85 },
  { id: 103, title: "Oversized Denim Jacket", category: "Men", image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop", condition: "New", price: 95, points: 200 },
  { id: 104, title: "Ceramic Vase", category: "Home", image_url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1974&auto=format&fit=crop", condition: "New", price: 60, points: 150 },
  { id: 105, title: "Classic White Tee", category: "Women", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop", condition: "New", price: 35, points: 40 },
  { id: 106, title: "Leather Boots", category: "Men", image_url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1974&auto=format&fit=crop", condition: "Worn", price: 75, points: 90 },
];

const ItemListing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const queryFilter = searchParams.get('query') || searchParams.get('q') || '';
  const [usingDemo, setUsingDemo] = useState(false);
  const [realCount, setRealCount] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        let displayItems = data;
        let demoUsed = false;
        setRealCount(Array.isArray(data) ? data.length : 0);

        // If no items from backend, show demo items (for first impression)
        if (!data || data.length === 0) {
          displayItems = DEMO_ITEMS;
          demoUsed = true;
        } else {
          // mix in demo items if very few real items? Optional. 
          // For now, let's append demo items if less than 4 real items so the grid looks good
          if (data.length < 4) {
            displayItems = [...data, ...DEMO_ITEMS];
            demoUsed = true;
          }
        }

        let filtered = categoryFilter
          ? displayItems.filter(i => i.category === categoryFilter)
          : displayItems;

        if (queryFilter) {
          const q = queryFilter.toLowerCase();
          filtered = filtered.filter((i) => (
            (i.title || '').toLowerCase().includes(q) ||
            (i.category || '').toLowerCase().includes(q) ||
            (i.tags || '').toLowerCase().includes(q) ||
            (i.description || '').toLowerCase().includes(q)
          ));
        }

        setItems(filtered || []);
        setUsingDemo(demoUsed);
      } catch (err) {
        // Fallback to demo items on error
        let filtered = categoryFilter
          ? DEMO_ITEMS.filter(i => i.category === categoryFilter)
          : DEMO_ITEMS;
        if (queryFilter) {
          const q = queryFilter.toLowerCase();
          filtered = filtered.filter((i) => (
            (i.title || '').toLowerCase().includes(q) ||
            (i.category || '').toLowerCase().includes(q) ||
            (i.tags || '').toLowerCase().includes(q) ||
            (i.description || '').toLowerCase().includes(q)
          ));
        }
        setItems(filtered);
        setUsingDemo(true);
        setRealCount(0);
      }
      setLoading(false);
    };
    fetchItems();
  }, [categoryFilter, queryFilter]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, queryFilter]);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const pagedItems = items.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="relative min-h-screen text-black overflow-hidden">
      <Squares className="opacity-30" direction="diagonal" speed={0.5} borderColor="#4b5563" hoverFillColor="#111827" squareSize={56} />
      {/* Header */}
      <div className="relative z-10 px-6 py-12 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
            {categoryFilter ? `${categoryFilter}'s Collection` : 'All Items'}
          </h1>
          {queryFilter && (
            <div className="mt-2 flex items-center gap-4">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Search: "{queryFilter}"
              </p>
              <Link
                to={categoryFilter ? `/items?category=${encodeURIComponent(categoryFilter)}` : "/items"}
                className="text-xs uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition"
              >
                Clear Search
              </Link>
            </div>
          )}
          <p className="text-gray-500 text-sm">
            {realCount} Products Available{usingDemo ? ' (showing demo items)' : ''}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading collection...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {pagedItems.map((item) => (
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

      {items.length > perPage && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 flex items-center justify-center gap-3 text-sm">
          <button
            className="px-3 py-2 border border-gray-300 hover:border-black"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`px-3 py-2 border ${p === page ? 'border-black' : 'border-gray-300 hover:border-black'}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="px-3 py-2 border border-gray-300 hover:border-black"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemListing;
