import React, { useState, useEffect } from 'react';

const images = [
  "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
  "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg",
  "https://images.pexels.com/photos/2983462/pexels-photo-2983462.jpeg"
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-b-3xl shadow-lg">
      <img
        src={images[current]}
        alt="carousel"
        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold">ReWear Collection</h1>
        <p className="mt-2 text-sm md:text-base">Swap. Style. Sustain.</p>
      </div>
    </div>
  );
};

export default Carousel;
