import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ label, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.04] transition-transform"
    >
      <div className="text-4xl">{icon}</div>
      <p className="mt-3 text-lg font-medium text-gray-700">{label}</p>
    </motion.div>
  );
};

export default CategoryCard;
