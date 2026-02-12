import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemById, requestSwap, getItems } from '../services/api';
import { FiChevronLeft, FiChevronRight, FiPlus, FiMinus } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';

// Demo Data (Matches Home/Listing demo data)
const DEMO_ITEMS = {
  101: { id: 101, title: "Minimalist Trench Coat", category: "Women", type: "Swap", size: "M", condition: "Like New", tags: "minimal, coat, beige", description: "A timeless beige trench coat with a clean silhouette. Perfect for transitional weather. Features a belt and deep pockets.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop", price: 85, points: 120, created_at: new Date().toISOString() },
  102: { id: 102, title: "Vintage Leather Satchel", category: "Accessories", type: "Swap", size: "One Size", condition: "Gently Used", tags: "vintage, leather, bag", description: "Authentic vintage leather satchel. Durable and stylish with a beautiful patina developed over time.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1590874102987-fdaef7d57a85?q=80&w=2080&auto=format&fit=crop", price: 120, points: 85, created_at: new Date().toISOString() },
  103: { id: 103, title: "Oversized Denim Jacket", category: "Men", type: "Swap", size: "L", condition: "New", tags: "denim, jacket, oversized", description: "Brand new oversized denim jacket. Never worn. classic wash that goes with everything.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop", price: 95, points: 200, created_at: new Date().toISOString() },
  104: { id: 104, title: "Ceramic Vase Collection", category: "Home", type: "Redeem", size: "N/A", condition: "New", tags: "decor, ceramic, vase", description: "Set of 3 handmade ceramic vases. Minimalist design ideal for modern interiors.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1974&auto=format&fit=crop", price: 60, points: 150, created_at: new Date().toISOString() },
  105: { id: 105, title: "Classic White Tee", category: "Women", type: "Redeem", size: "S", condition: "New", tags: "basic, cotton, white", description: "Premium cotton white t-shirt. Essential wardrobe staple.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop", price: 35, points: 40, created_at: new Date().toISOString() },
  106: { id: 106, title: "Leather Boots", category: "Men", type: "Redeem", size: "10 (US)", condition: "Worn", tags: "boots, leather, brown", description: "Sturdy leather boots with plenty of life left. Recently resoled.", username: "DemoUser", image_url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1974&auto=format&fit=crop", price: 75, points: 90, created_at: new Date().toISOString() },
};


const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swapMsg, setSwapMsg] = useState('');
  const [buyMsg, setBuyMsg] = useState('');

  // Accordion states
  const [openSection, setOpenSection] = useState('description'); // 'description', 'details', or null

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const fetchItemAndRelated = async () => {
      setLoading(true);
      setError('');
      setItem(null);

      // Check for Demo ID first
      if (DEMO_ITEMS[id]) {
        setItem(DEMO_ITEMS[id]);
        // Mock similar items for demo
        const others = Object.values(DEMO_ITEMS).filter(i => i.id !== parseInt(id)).slice(0, 4);
        setSimilarItems(others);
        setLoading(false);
        return;
      }

      // If not demo, fetch from API
      try {
        const data = await getItemById(id);
        if (data && data.title) {
          setItem(data);
          // Fetch similar items 
          const allItems = await getItems();
          const others = allItems.filter(i => i.id !== parseInt(id)).slice(0, 4);
          setSimilarItems(others);
        } else {
          setError('Item not found.');
        }
      } catch (err) {
        // Fallback or just error
        setError('Item not found or failed to load.');
      }
      setLoading(false);
    };
    fetchItemAndRelated();
  }, [id]);



  const [activeImage, setActiveImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    if (item) {
      let images = [item.image_url];
      if (item.additional_images) {
        try {
          // If stored as JSON string
          const extras = JSON.parse(item.additional_images);
          if (Array.isArray(extras)) {
            images = [...images, ...extras];
          }
        } catch (e) {
          // Fallback if somehow not JSON
          console.error("Failed to parse additional images", e);
        }
      }
      // Demo items might not have additional images structure yet, but we can verify logic
      setAllImages(images);
      setActiveImage(images[0]);
    }
  }, [item]);


  // ... (fetch logic same)

  const handleSwapRequest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setSwapMsg('Sending request...'); // Immediate feedback

    // If it's a demo item, simulate success
    if (DEMO_ITEMS[id]) {
      setTimeout(() => {
        setSwapMsg("Swap Request Sent!");
        setTimeout(() => navigate('/dashboard'), 1000);
      }, 800);
      return;
    }

    if (!item) return;
    try {
      const result = await requestSwap(item.id, token);
      setSwapMsg(result.msg || result.error || 'Swap request sent!');
      if (result.msg) {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setSwapMsg('Failed to send swap request.');
    }
  };

  const handleBuy = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBuyMsg('Purchase flow coming soon.');
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-sm font-medium tracking-wide">Loading...</div>;
  if (!item && !loading) return <div className="h-screen flex items-center justify-center text-sm">Item not found.</div>;

  return (
    <div className="bg-white text-black min-h-screen">

      {/* --- Main Product Section --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-50 overflow-hidden w-full relative">
              <img
                src={activeImage || item.image_url || '/placeholder.jpg'}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 bg-gray-100 flex-shrink-0 cursor-pointer border transition ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-500'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details (Sticky) */}
          <div className="md:sticky md:top-24 h-fit space-y-8">

            <div className="border-b border-black pb-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.category} / {item.type}</span>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{item.title}</h1>
              <div className="text-xl font-medium pt-2">
                {item.price != null && item.price !== '' ? `Price: $${Number(item.price).toFixed(2)}` : 'Available for Swap'}
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-4 pt-2">
              {swapMsg && <div className={`p-3 text-sm text-center font-bold uppercase tracking-wide ${swapMsg.includes('Failed') ? 'bg-red-100 text-red-600' : 'bg-black text-white'}`}>{swapMsg}</div>}
              {buyMsg && <div className="p-3 text-sm text-center font-bold uppercase tracking-wide bg-gray-100 text-gray-800">{buyMsg}</div>}

              {localStorage.getItem('token') &&
                item.username !== (JSON.parse(localStorage.getItem('user'))?.username) ? (
                <div className="space-y-3">
                  <button
                    onClick={handleSwapRequest}
                    disabled={swapMsg === 'Sending request...'}
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-500"
                  >
                    {swapMsg === 'Sending request...' ? 'Processing...' : 'Request Swap'}
                  </button>
                  {item.price != null && item.price !== '' && (
                    <button
                      onClick={handleBuy}
                      className="w-full border border-black text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full bg-gray-200 text-gray-500 py-4 font-bold uppercase tracking-widest text-sm text-center cursor-pointer hover:bg-gray-300 transition" onClick={() => navigate('/login')}>
                  {item.username === (JSON.parse(localStorage.getItem('user'))?.username)
                    ? "Your Item"
                    : (item.price != null && item.price !== '' ? "Login to Continue" : "Login to Swap")}
                </div>
              )}

              <p className="text-xs text-gray-500 text-center uppercase tracking-wide">
                Listed by <span className="text-black font-semibold">{item.username}</span> on {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Accordion / Info Sections */}
            <div className="border-t border-gray-200">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('description')}
                  className="flex justify-between items-center w-full text-left font-bold text-sm uppercase tracking-wide py-4 hover:text-gray-600"
                >
                  <span>Description</span>
                  {openSection === 'description' ? <FiMinus /> : <FiPlus />}
                </button>
                {openSection === 'description' && (
                  <div className="pb-4 text-sm text-gray-700 leading-relaxed max-w-prose animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.description}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('details')}
                  className="flex justify-between items-center w-full text-left font-bold text-sm uppercase tracking-wide py-4 hover:text-gray-600"
                >
                  <span>Details</span>
                  {openSection === 'details' ? <FiMinus /> : <FiPlus />}
                </button>
                {openSection === 'details' && (
                  <div className="pb-4 text-sm text-gray-700 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p><span className="font-semibold">Size:</span> {item.size}</p>
                    <p><span className="font-semibold">Condition:</span> {item.condition}</p>
                    <p><span className="font-semibold">Tags:</span> {item.tags || 'None'}</p>
                    <p><span className="font-semibold">Points Value:</span> {item.points}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- Why We Chose This (MoMA-style Banner) --- */}
      <div className="bg-[#FFD700] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Why We Chose This</h2>
          <p className="text-lg md:text-xl text-black font-medium leading-relaxed">
            "This item represents a unique approach to sustainable fashion. By choosing pre-loved {item.category.toLowerCase()}, you're participating in a circular economy that values design longevity over fast consumption."
          </p>
        </div>
      </div>

      {/* --- You Might Also Like Carousel --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest">You Might Also Like</h2>
          <Link to="/items" className="text-xs font-bold uppercase border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition">View All</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {similarItems.length > 0 ? similarItems.map(simItem => (
            <Link
              key={simItem.id}
              to={`/item/${simItem.id}`}
              className="cursor-pointer"
              onClick={() => window.scrollTo(0, 0)} // Reset scroll on nav
            >
              <ProductCard item={simItem} />
            </Link>
          )) : (
            <p className="text-sm text-gray-500">More items coming soon.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ItemDetails;
