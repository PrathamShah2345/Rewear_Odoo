import React, { useState, useEffect } from 'react';

const CategoryCardCarousel = ({ title, images, onClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500); // change image every 2.5s
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer rounded-2xl overflow-hidden group hover:scale-[1.03] transition-transform duration-200 shadow-lg"
    >
      <img
        src={images[index]}
        alt={`${title} preview`}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="text-white text-xl font-bold drop-shadow">{title}</span>
      </div>
    </div>
  );
};

export default CategoryCardCarousel;
