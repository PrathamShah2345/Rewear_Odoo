import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Demo Data for "Sample/Demo" display
const DEMO_PRODUCTS = [
  {
    id: 101,
    title: "Minimalist Trench Coat",
    category: "Women",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    condition: "Like New",
    points: 120
  },
  {
    id: 102,
    title: "Vintage Leather Satchel",
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1590874102987-fdaef7d57a85?q=80&w=2080&auto=format&fit=crop",
    condition: "Gently Used",
    points: 85
  },
  {
    id: 103,
    title: "Oversized Denim Jacket",
    category: "Men",
    image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop",
    condition: "New",
    points: 200
  },
  {
    id: 104,
    title: "Ceramic Vase Collection",
    category: "Home", // Example of extending categories
    image_url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1974&auto=format&fit=crop",
    condition: "New",
    points: 150
  }
];

const Home = () => {
  return (
    <div className="bg-white text-black">

      {/* Hero Section - Split Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh] border-b border-black">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 bg-[#F5F5F5]">
          <span className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">New Collection</span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Design for <br /> Everyone.
          </h1>
          <p className="text-lg text-gray-700 max-w-md mb-10 leading-relaxed">
            Discover curated pre-loved fashion items. Join our community of circular design enthusiasts.
          </p>
          <div>
            <Link
              to="/items"
              className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative h-full min-h-[50vh] bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
            alt="Fashion Hero"
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </section>

      {/* Featured Categories - Grid with Images */}
      <section className="py-20 px-4 md:px-8 border-b border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">

            {/* Men */}
            <Link to="/items?category=Men" className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=1974&auto=format&fit=crop"
                alt="Men"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs shadow-custom pointer-events-auto">
                  Men
                </span>
              </div>
            </Link>

            {/* Women */}
            <Link to="/items?category=Women" className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
                alt="Women"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs shadow-custom pointer-events-auto">
                  Women
                </span>
              </div>
            </Link>

            {/* Accessories */}
            <Link to="/items?category=Accessories" className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2000&auto=format&fit=crop"
                alt="Accessories"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs shadow-custom pointer-events-auto">
                  Accessories
                </span>
              </div>
            </Link>

            {/* Kids */}
            <Link to="/items?category=Kids" className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2670&auto=format&fit=crop"
                alt="Kids"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs shadow-custom pointer-events-auto">
                  Kids
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* New Arrivals / Demo Section */}
      <section className="py-20 px-4 md:px-8 border-b border-black bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tight">New Arrivals</h2>
            <Link to="/items" className="text-xs font-bold uppercase border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition">View All</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DEMO_PRODUCTS.map((product) => (
              <Link key={product.id} to={`/item/${product.id}`} className="cursor-pointer">
                <ProductCard item={product} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-[#FFD700] py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">Sustainable Style</h2>
        <p className="max-w-2xl mx-auto text-xl font-medium">
          Every item creates a story. Start your next chapter with ReWear.
        </p>
      </section>

    </div>
  );
};

export default Home;
