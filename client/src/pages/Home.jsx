// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import { getItems } from '../services/api';
import CategoryCardCarousel from '../components/CategoryCardCarousel';

const Home = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleCardClick = (category) => {
    navigate(`/items?category=${category}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <p className="text-emerald-600 text-lg font-semibold animate-pulse">
          Loading ReWear...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-5 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Carousel />
      </motion.div>

      {/* Welcome Section */}
      <motion.section
        className="py-10 px-6 md:px-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 drop-shadow mb-4">
          Welcome to ReWear
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
      </motion.section>

      {/* Featured Categories */}
      <motion.section
        className="px-6 md:px-12 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-emerald-900 text-center md:text-left">
          Featured Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CategoryCardCarousel
            title="Men"
            images={['/category/men1.jpg', '/category/men2.jpg']}
            onClick={() => handleCardClick('Men')}
          />
          <CategoryCardCarousel
            title="Women"
            images={['/category/women1.jpg', '/category/women2.jpg']}
            onClick={() => handleCardClick('Women')}
          />
          <CategoryCardCarousel
            title="Kids"
            images={['/category/kids1.jpg', '/category/kids2.jpg']}
            onClick={() => handleCardClick('Kids')}
          />
          <CategoryCardCarousel
            title="Accessories"
            images={['/category/accessories1.jpg', '/category/accessories2.jpg']}
            onClick={() => handleCardClick('Accessories')}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
