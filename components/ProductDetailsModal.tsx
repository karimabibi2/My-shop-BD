
import React from 'react';
import { X, ShoppingCart, Zap, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { trackingService } from '../services/TrackingService';
import { MessageSquare } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onBuyNow }) => {
  const { addToCart, removeFromCart, cart } = useCart();
  const { globalOrderPolicy, user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = React.useState<'description' | 'policy' | 'reviews'>('description');
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [reviewText, setReviewText] = React.useState('');
  const [isReviewSent, setIsReviewSent] = React.useState(false);
  const [localReviews, setLocalReviews] = React.useState([
    { id: 1, user: 'Karim Ahmed', rating: 5, comment: 'Excellent product! Very fast delivery.', date: '2 days ago' },
    { id: 2, user: 'Sultana Begum', rating: 4, comment: 'Good quality, but packaging could be better.', date: '1 week ago' },
    { id: 3, user: 'Rahat Khan', rating: 5, comment: 'Highly recommended. Authentic item.', date: '2 weeks ago' },
  ]);

  React.useEffect(() => {
    if (product) {
      trackingService.trackViewItem(product);
    }
  }, [product]);

  if (!product) return null;

  const isInCart = cart.some(item => item.id === product.id && item.selectedSize === selectedSize);
  const oldPrice = Math.round(product.price * 1.25);

  const handleCartToggle = () => {
    if (isInCart) {
      // In a real app, we might want to remove the specific size, but for now we'll just remove by ID and size
      // Actually removeFromCart only takes productId, so we might need to update it too if we want to be precise
      removeFromCart(product.id);
    } else {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert(t('select_size'));
        return;
      }
      addToCart(product, selectedSize || undefined);
      trackingService.trackAddToCart({ ...product, quantity: 1, selectedSize: selectedSize || undefined });
    }
  };

  const handleSendReview = () => {
    if (!reviewText.trim()) return;
    
    const newReview = {
      id: Date.now(),
      user: user?.name || 'Guest User',
      rating: 5, // Default rating for now
      comment: reviewText,
      date: 'Just now'
    };

    setLocalReviews(prev => [newReview, ...prev]);
    setIsReviewSent(true);
    setReviewText('');
    setTimeout(() => setIsReviewSent(false), 3000);
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full text-gray-800 dark:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto no-scrollbar">
              {/* Product Image */}
              <div className="relative aspect-square bg-white flex items-center justify-center p-8">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop';
                  }}
                />
                <div className="absolute top-4 left-4 bg-[#e62e04] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  20% OFF
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#e62e04] uppercase tracking-widest bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-bold">{product.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white leading-tight">
                    {product.name}
                  </h2>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#e62e04]">৳{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through font-bold">৳{oldPrice.toLocaleString()}</span>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('select_size')}</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[40px] h-10 px-3 rounded-xl text-xs font-black transition-all border-2 ${
                            selectedSize === size
                              ? 'border-[#e62e04] bg-[#e62e04] text-white shadow-lg shadow-red-100'
                              : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-slate-800 mt-2">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'description' ? 'text-[#e62e04] border-b-2 border-[#e62e04]' : 'text-gray-400'}`}
                  >
                    {t('description')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('policy')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'policy' ? 'text-[#e62e04] border-b-2 border-[#e62e04]' : 'text-gray-400'}`}
                  >
                    {t('order_policy')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'text-[#e62e04] border-b-2 border-[#e62e04]' : 'text-gray-400'}`}
                  >
                    {t('reviews')}
                  </button>
                </div>

                <div className="min-h-[100px] py-2">
                  {activeTab === 'description' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        {product.description || "No description available for this product."}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'policy' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase whitespace-pre-wrap leading-relaxed">
                        {product.orderPolicy || globalOrderPolicy}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <span className="text-[9px] font-black uppercase text-[#e62e04] tracking-widest">{t('write_review')}</span>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder={t('write_review_placeholder')}
                            className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-[10px] font-bold dark:text-white"
                          />
                          <button 
                            onClick={handleSendReview}
                            disabled={isReviewSent}
                            className={`${isReviewSent ? 'bg-green-500' : 'bg-[#e62e04]'} text-white p-2 rounded-xl active:scale-95 transition-all flex items-center justify-center min-w-[40px]`}
                          >
                            {isReviewSent ? <ShieldCheck size={16} /> : <MessageSquare size={16} />}
                          </button>
                        </div>
                        {isReviewSent && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-1"
                          >
                            {t('review_sent_success') || 'Review sent successfully!'}
                          </motion.span>
                        )}
                      </div>

                      {localReviews.map(review => (
                        <div key={review.id} className="flex flex-col gap-1 border-b border-gray-50 dark:border-slate-800 pb-3 last:border-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-gray-800 dark:text-white">{review.user}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={8} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">{t('authentic')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <Truck size={16} className="text-blue-500" />
                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">{t('fast_delivery')}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <RotateCcw size={16} className="text-orange-500" />
                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">{t('return_policy')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-3">
              <button 
                onClick={handleCartToggle}
                className={`flex-1 py-3.5 rounded-2xl flex justify-center items-center gap-2 transition-all font-black text-[11px] uppercase tracking-widest ${
                  isInCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ShoppingCart size={18} />
                {isInCart ? t('in_cart') : t('add_to_cart')}
              </button>
              <button 
                onClick={() => {
                  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    alert(t('select_size'));
                    return;
                  }
                  onBuyNow({ ...product, sizes: selectedSize ? [selectedSize] : product.sizes });
                }}
                className="flex-[1.5] bg-[#e62e04] text-white py-3.5 rounded-2xl flex justify-center items-center gap-2 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-none active:scale-95 transition-all"
              >
                <Zap size={16} fill="currentColor" />
                {t('buy_now')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
