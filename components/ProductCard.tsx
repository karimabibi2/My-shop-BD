
import React from 'react';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onOpenDetails: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, removeFromCart, cart } = useCart();
  const navigate = useNavigate();

  const isInCart = cart.some(item => item.id === product.id);
  const oldPrice = Math.round(product.price * 1.25);
  const discountPercent = 20;

  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetails();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
  };

  return (
    <div 
      onClick={onOpenDetails}
      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-all relative group h-full rounded-xl overflow-hidden cursor-pointer"
    >
      {/* Discount Badge */}
      <div className="absolute top-0 left-0 z-10 bg-[#e62e04] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">
        -{discountPercent}% OFF
      </div>

      <div className="relative aspect-square overflow-hidden bg-white dark:bg-white p-2 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          onError={handleImageError}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-3 flex flex-col flex-1 border-t border-gray-50 dark:border-slate-800">
        <h3 className="text-[12px] font-bold text-gray-800 dark:text-gray-200 leading-tight line-clamp-2 h-8 mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-black text-[#e62e04]">৳{product.price.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through font-bold">৳{oldPrice.toLocaleString()}</span>
        </div>

        <div className="mt-auto flex gap-1.5">
          <button 
            onClick={handleCartToggle}
            className={`flex-1 p-2.5 rounded-lg flex justify-center items-center transition-all duration-300 ${
              isInCart 
                ? 'bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-none' 
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
            title={isInCart ? "Remove from Cart" : "Add to Cart"}
          >
            {isInCart ? <Check size={18} strokeWidth={3} /> : <ShoppingCart size={18} />}
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-[2.5] bg-[#e62e04] text-white text-[10px] font-black py-2.5 rounded-lg flex justify-center items-center gap-1.5 hover:bg-[#c42704] transition-all active:scale-95 uppercase tracking-widest shadow-sm"
          >
            <Zap size={12} fill="currentColor" />
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
