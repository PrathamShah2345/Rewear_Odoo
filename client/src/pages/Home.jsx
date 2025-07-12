// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';

const demoItems = [
  {
    id: 1,
    title: "Men",
    imageUrl: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg",
  },
  {
    id: 2,
    title: "Women",
    imageUrl: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
  },
  {
    id: 3,
    title: "Kids",
    imageUrl: "https://images.pexels.com/photos/1632553/pexels-photo-1632553.jpeg",
  },
  {
    id: 4,
    title: "Accessories",
    imageUrl: "https://images.pexels.com/photos/4041687/pexels-photo-4041687.jpeg",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (category) => {
    navigate(`/items?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 py-5 text-gray-800">
      <Carousel />

      {/* Welcome Section */}
      <section className="py-10 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 drop-shadow mb-4">
          Welcome to ReWear 👕
        </h1>
        <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
          ReWear is your go-to platform to swap stylish, sustainable clothing with others. List what you don’t need, find what you love.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
          >
            Start Swapping
          </button>
          <button
            onClick={() => navigate('/items')}
            className="bg-white border border-green-500 text-green-700 px-6 py-2 rounded-full hover:bg-green-100 transition"
          >
            Browse Items
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition"
          >
            List an Item
          </button>
        </div>
      </section>

      {/* Category Cards in Place of Popular Picks */}
      <section className="px-6 md:px-12 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-emerald-900 text-center md:text-left">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {demoItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.title)}
              className="relative cursor-pointer rounded-2xl overflow-hidden group hover:scale-[1.03] transition-transform duration-200 shadow-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xl font-bold drop-shadow">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
