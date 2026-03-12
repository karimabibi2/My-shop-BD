
import React from 'react';
import Layout from '../components/Layout';
import { CATEGORIES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Briefcase, 
  Shirt, 
  Smartphone, 
  LayoutGrid,
  ChevronRight 
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'All': <LayoutGrid size={24} />,
  'Electronic': <Laptop size={24} />,
  'Office': <Briefcase size={24} />,
  'Fashion': <Shirt size={24} />,
  'Mobile': <Smartphone size={24} />,
};

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Navigate home and potentially pass state to filter, 
    // but for now we'll just show the list as requested.
    navigate('/');
  };

  return (
    <Layout title="Categories">
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-2 px-1">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#e62e04] group-hover:bg-[#e62e04] group-hover:text-white transition-colors">
                  {categoryIcons[cat] || <LayoutGrid size={24} />}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-800">{cat}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Explore Collection</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#e62e04] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
