
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Sparkles, Loader2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { getRecommendedProducts } from '../services/geminiService';
import { Product } from '../types';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        const recommended = await getRecommendedProducts(query, MOCK_PRODUCTS);
        setResults(recommended);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <Layout title="Search">
      <div className="flex flex-col gap-6 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products with AI..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin" size={20} />
          )}
        </div>

        {!query && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {['iPhone', 'MacBook', 'Headphones', 'Lego'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-xs font-medium text-gray-600"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900">Search Results</h3>
            <div className="grid grid-cols-2 gap-4">
              {results.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && !isSearching && (
          <div className="text-center py-12 text-gray-400">
            No results found for "{query}"
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
