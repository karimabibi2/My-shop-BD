
import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { categories } = useAuth();
  const { t } = useLanguage();

  const handleCategoryClick = (categoryName: string) => {
    // Navigate home and potentially pass state to filter, 
    // but for now we'll just show the list as requested.
    navigate('/');
  };

  return (
    <Layout title={t('categories')}>
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest mb-2 px-1">
          {t('shop_by_category')}
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-[#e62e04] group-hover:bg-[#e62e04] group-hover:text-white transition-colors overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    categoryIcons[cat.name] || <LayoutGrid size={24} />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{cat.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{t('explore_collection')}</span>
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
