import { Link } from 'react-router-dom';

const ProductCard = ({ item }) => {
  return (
    <div className="group block h-full">
      {/* Image Container - Square Aspect Ratio */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4">
        <img
          src={item.image_url || '/logo.png'}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Helper overlay for status/condition */}
        {item.condition === 'New' && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
            New Arrival
          </span>
        )}
      </div>

      {/* Content - Minimal text below */}
      <div className="space-y-1">
        {/* Category / Brand eyebrow */}
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.category}</p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-black leading-tight group-hover:underline underline-offset-4 decoration-1">
          {item.title}
        </h3>

        {/* Price/Points */}
        <p className="text-sm text-gray-900 font-medium pt-1">
          {item.price != null && item.price !== ''
            ? `$${Number(item.price).toFixed(2)}`
            : 'Swap Item'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
