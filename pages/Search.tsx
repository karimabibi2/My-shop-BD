
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { getRecommendedProducts } from '../services/geminiService';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { allProducts } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product: Product) => {
    const isInCart = cart.some(item => item.id === product.id);
    if (!isInCart) {
      addToCart(product);
    }
    setSelectedProduct(null);
    navigate('/cart');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        const recommended = await getRecommendedProducts(query, allProducts);
        setResults(recommended);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, allProducts]);

  return (
    <Layout title="Search">
      <div className="flex flex-col gap-6 py-2 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products with AI..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#e62e04] text-sm shadow-sm dark:text-white transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e62e04] animate-spin" size={20} />
          )}
        </div>

        {!query && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {['iPhone', 'MacBook', 'Headphones', 'Lego'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 transition-colors shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Search Results</h3>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{results.length} Items</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-10">
              {results.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onOpenDetails={() => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && !isSearching && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <SearchIcon size={32} />
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
          </div>
        )}
      </div>

      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onBuyNow={handleBuyNow}
      />
    </Layout>
  );
};

export default Search;
