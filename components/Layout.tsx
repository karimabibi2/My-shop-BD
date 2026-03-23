
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, ShoppingCart, User, Bell, Package, Menu, X, 
  ChevronRight, Grid, Moon, Sun, ShieldAlert, MessageCircle,
  Youtube, Facebook, Languages
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { totalItems } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, categories, whatsappNumber, facebookLink, youtubeLink, tiktokLink } = useAuth();
  const { activeCategory, setActiveCategory, isDrawerOpen, setIsDrawerOpen } = useCategory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to MY shopBD!',
      message: 'Explore the best products directly curated for you.',
      time: 'Just now',
      isRead: false
    }
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname, setIsDrawerOpen]);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setIsDrawerOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const toggleCategoryDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMainMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDrawerOpen) setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 max-w-md mx-auto relative shadow-xl overflow-hidden font-sans border-x border-gray-100 dark:border-slate-900 transition-colors duration-300">
      
      {/* --- Main Sidebar (Hamburger Menu) --- */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-[#e62e04] text-white">
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-black tracking-tighter italic uppercase">{t('menu')}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 py-2 overflow-y-auto no-scrollbar">
              <NavLink to="/" onClick={() => setActiveCategory('All')} className="flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 font-bold text-sm border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                <Home size={20} className="text-gray-400" /> {t('home')}
              </NavLink>
              
              <button onClick={() => { setIsMenuOpen(false); setIsDrawerOpen(true); }} className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 font-bold text-sm border-b border-gray-50 dark:border-slate-800 text-left hover:bg-gray-50 dark:hover:bg-slate-800">
                <Grid size={20} className="text-gray-400" /> {t('all_categories')}
              </button>
              
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 font-bold text-sm border-b border-gray-50 dark:border-slate-800 text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-400" />}
                {isDarkMode ? t('light_mode') : t('dark_mode')}
              </button>

              <div className="flex flex-col border-b border-gray-50 dark:border-slate-800">
                <div className="flex items-center gap-4 px-6 py-3 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                  <Languages size={16} /> {t('language')}
                </div>
                <div className="flex px-6 pb-4 gap-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${language === 'en' ? 'bg-[#e62e04] text-white border-[#e62e04]' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 border-gray-100 dark:border-slate-700'}`}
                  >
                    {t('english')}
                  </button>
                  <button 
                    onClick={() => setLanguage('bn')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${language === 'bn' ? 'bg-[#e62e04] text-white border-[#e62e04]' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 border-gray-100 dark:border-slate-700'}`}
                  >
                    {t('bangla')}
                  </button>
                </div>
              </div>

              <NavLink to="/orders" className="flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 font-bold text-sm border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                <Package size={20} className="text-gray-400" /> {t('my_orders')}
              </NavLink>
              <NavLink to="/profile" className="flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 font-bold text-sm border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                <User size={20} className="text-gray-400" /> {t('account')}
              </NavLink>

              {/* Admin Link - More prominent for easy access */}
              {user?.isAdmin && (
                <div className="mt-auto pt-6 pb-6 px-6 border-t border-gray-100 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/20">
                  <NavLink 
                    to="/admin" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-[11px] font-black text-[#e62e04] uppercase tracking-[0.2em] shadow-sm hover:shadow-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  >
                    <ShieldAlert size={18} />
                    {t('admin_panel')}
                  </NavLink>
                  <p className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center mt-3">
                    Restricted Management Access
                  </p>
                </div>
              )}

              <div className="mt-6 px-6 flex flex-col gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('follow_us')}</span>
                <div className="flex gap-4">
                  <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl hover:scale-110 transition-transform">
                    <Facebook size={20} />
                  </a>
                  <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:scale-110 transition-transform">
                    <Youtube size={20} />
                  </a>
                  <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white rounded-xl hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13-.08-.26-.17-.38-.26v7.02c0 3.11-1.8 5.54-4.57 6.32-2.33.66-5.13.14-6.77-1.72-1.6-1.81-1.9-4.74-.46-6.78 1.14-1.62 3.16-2.39 5.08-2.09v4.27c-.67-.13-1.39-.14-2.01.23-.72.43-1.18 1.23-1.14 2.06.03.76.46 1.47 1.11 1.81.65.34 1.44.31 2.04-.08.6-.39.91-1.07.92-1.78V.02z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Category Drawer --- */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${isDrawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-[240px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <X size={22} />
              </button>
              <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Categories</span>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-white dark:bg-slate-900">
              <button 
                onClick={() => handleCategorySelect('All')}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-50 dark:border-slate-800 ${activeCategory === 'All' ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[#e62e04]">
                  <Grid size={20} />
                </div>
                <span className={`text-[12px] font-bold ${activeCategory === 'All' ? 'text-[#e62e04]' : 'text-gray-700 dark:text-gray-300'}`}>All Categories</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-50 dark:border-slate-800 ${activeCategory === cat ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex-shrink-0">
                      <img 
                        src={`https://picsum.photos/seed/${cat.replace(/[^a-zA-Z]/g, '')}/100/100`} 
                        alt={cat}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  <span className={`text-[12px] font-bold text-left flex-1 ${activeCategory === cat ? 'text-[#e62e04]' : 'text-gray-700 dark:text-gray-300'}`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={toggleMainMenu} className="p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded transition-colors">
              <Menu size={26} />
            </button>
            <div className="flex flex-col leading-none" onClick={() => { setActiveCategory('All'); navigate('/'); }}>
              <span className="text-lg font-black text-[#e62e04] tracking-tighter italic cursor-pointer">MY SHOP</span>
              <span className="text-[8px] font-bold text-gray-900 dark:text-white tracking-[0.2em] uppercase cursor-pointer">BD</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {user?.isAdmin && (
              <NavLink to="/admin" className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#e62e04] dark:hover:text-[#e62e04] hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ShieldAlert size={22} />
              </NavLink>
            )}
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 text-gray-700 dark:text-gray-300 relative hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#e62e04] text-white text-[8px] font-bold rounded-full border border-white dark:border-slate-900 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <NavLink to="/profile" className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              {user ? (
                <img 
                  src={user.avatar} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700" 
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
                  }}
                />
              ) : (
                <div className="p-1 text-gray-700 dark:text-gray-300">
                  <User size={22} />
                </div>
              )}
            </NavLink>
          </div>

          {/* Notifications Panel */}
          {isNotificationsOpen && (
            <div ref={notificationRef} className="absolute top-full right-4 w-64 bg-white dark:bg-slate-800 shadow-2xl border border-gray-100 dark:border-slate-700 rounded-b-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="bg-gray-50 dark:bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Updates</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 border-b border-gray-50 dark:border-slate-700 flex flex-col gap-1 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="text-[11px] font-bold text-gray-800 dark:text-white">{n.title}</span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto no-scrollbar">
        {children}
        
        {/* Simple Footer with Admin Link */}
        <footer className="mt-auto py-10 px-6 border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-900/50 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center leading-none mb-2">
            <span className="text-xl font-black text-[#e62e04] tracking-tighter italic">MY SHOP</span>
            <span className="text-[10px] font-bold text-gray-900 dark:text-white tracking-[0.2em] uppercase">BD</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            © {new Date().getFullYear()} MY shopBD. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            {user?.isAdmin && (
              <NavLink to="/admin" className="text-[10px] font-black text-gray-400 hover:text-[#e62e04] uppercase tracking-widest transition-colors">
                {t('admin_panel')}
              </NavLink>
            )}
            <a 
              href="https://my-shop-bd.vercel.app/#/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-gray-400 hover:text-[#e62e04] uppercase tracking-widest transition-colors"
            >
              {t('visit_live_dashboard')}
            </a>
            <NavLink to="/profile" className="text-[10px] font-black text-gray-400 hover:text-[#e62e04] uppercase tracking-widest transition-colors">
              {t('account')}
            </NavLink>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-1 py-1 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <NavLink to="/" onClick={() => setActiveCategory('All')} className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${isActive && !isDrawerOpen ? 'text-[#e62e04]' : 'text-gray-400 dark:text-gray-500'}`}>
          <Home size={22} />
          <span className="text-[9px] font-bold">{t('home')}</span>
        </NavLink>
        <button 
          onClick={toggleCategoryDrawer}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${isDrawerOpen ? 'text-[#e62e04]' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Grid size={22} />
          <span className="text-[9px] font-bold">{t('category')}</span>
        </button>
        <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${isActive ? 'text-[#e62e04]' : 'text-gray-400 dark:text-gray-500'}`}>
          <Package size={22} />
          <span className="text-[9px] font-bold">{t('my_orders')}</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg relative transition-all ${isActive ? 'text-[#e62e04]' : 'text-gray-400 dark:text-gray-500'}`}>
          <div className="relative">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#e62e04] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white dark:border-slate-900">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold">{t('cart')}</span>
        </NavLink>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[#25D366] transition-all">
          <MessageCircle size={22} />
          <span className="text-[9px] font-bold uppercase">{t('whatsapp')}</span>
        </a>
      </nav>
    </div>
  );
};

export default Layout;
