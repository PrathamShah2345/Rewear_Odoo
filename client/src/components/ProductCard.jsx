import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const tagArray = item.tags ? item.tags.split(',').map(tag => tag.trim()) : [];

  const handleClick = () => {
    navigate(`/upload?id=${item.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className="cursor-pointer bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>

        {tagArray.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tagArray.map((tag, idx) => (
              <span
                key={idx}
                className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
