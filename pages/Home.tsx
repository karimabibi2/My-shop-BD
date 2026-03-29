
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { allProducts, bannerImage, categories, isDataReady, isPromoBannerEnabled } = useAuth();
  const { activeCategory, setActiveCategory, setIsDrawerOpen } = useCategory();
  const { addToCart, cart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(null);
    navigate('/checkout', { state: { buyNowProduct: product } });
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, allProducts]);

  const categorizedProducts = useMemo(() => {
    if (activeCategory !== 'All' || searchQuery) return [];
    
    return categories
      .filter(cat => cat.name !== 'All')
      .map(cat => ({
        name: cat.name,
        products: allProducts.filter(p => p.category === cat.name).slice(0, 8)
      }))
      .filter(group => group.products.length > 0);
  }, [activeCategory, searchQuery, categories, allProducts]);

  return (
    <Layout>
      <div className="p-4 flex flex-col gap-4">
        {/* Main Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg py-2.5 pl-4 pr-10 focus:border-[#e62e04] dark:focus:border-[#e62e04] focus:ring-0 text-sm transition-all shadow-sm dark:text-white"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500"
              >
                <X size={16} />
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
                <Search size={18} />
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-[#e62e04] text-white p-2.5 rounded-lg flex items-center justify-center shadow-md shadow-red-100 dark:shadow-none active:scale-95 transition-all"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Banner */}
        {activeCategory === 'All' && !searchQuery && isPromoBannerEnabled && (
          <div className="rounded-xl overflow-hidden relative shadow-md h-36 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-900 dark:to-red-700">
            {bannerImage && (
              <img 
                src={bannerImage} 
                alt="Promo Banner" 
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{t('premium_collection')}</span>
              <h2 className="text-2xl font-black italic tracking-tighter leading-none mb-2 text-white">MY shopBD</h2>
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#e62e04] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">{t('best_prices')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Breadcrumb */}
        {(activeCategory !== 'All' || searchQuery) && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">{t('filter')}</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {activeCategory !== 'All' && (
                  <span className="bg-red-50 dark:bg-red-950/30 text-[#e62e04] text-[10px] font-black px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900 uppercase whitespace-nowrap">
                    {activeCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-100 dark:border-slate-700 whitespace-nowrap">
                    "{searchQuery}"
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} 
              className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase hover:text-[#e62e04] ml-2"
            >
              {t('clear')}
            </button>
          </div>
        )}

        {/* Grid Title */}
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">
            {activeCategory === 'All' ? t('latest_products') : activeCategory}
          </h3>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {filteredProducts.length} {t('items')}
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-2">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpenDetails={() => setSelectedProduct(product)}
              onBuyNow={handleBuyNow}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
              {!isDataReady ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#e62e04] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <Search size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('no_items_matched')}</p>
                  <button 
                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} 
                    className="mt-4 text-[#e62e04] text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900 px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    {t('reset_filter')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Categorized Sections */}
        {categorizedProducts.length > 0 && (
          <div className="flex flex-col gap-10 pt-6 pb-10 border-t border-gray-100 dark:border-slate-800">
            <div className="text-center mb-2">
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-1">{t('shop_by_category')}</h2>
              <div className="w-12 h-1 bg-[#e62e04] mx-auto rounded-full"></div>
            </div>
            
            {categorizedProducts.map(group => (
              <div key={group.name} className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#e62e04] rounded-full"></span>
                    {group.name}
                  </h3>
                  <button 
                    onClick={() => setActiveCategory(group.name)}
                    className="text-[10px] font-black text-[#e62e04] uppercase tracking-widest hover:underline"
                  >
                    {t('view_all')}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {group.products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onOpenDetails={() => setSelectedProduct(product)}
                      onBuyNow={handleBuyNow}
                    />
                  ))}
                </div>
              </div>
            ))}
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

export default Home;
