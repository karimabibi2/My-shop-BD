
import React, { ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, Package, ShoppingCart, Settings, 
  Layers, ShieldAlert, LogOut, Home, Moon, Sun,
  Menu, X, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
      {/* Top Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin')}>
            <div className="w-8 h-8 bg-[#e62e04] rounded-lg flex items-center justify-center text-white">
              <ShieldAlert size={18} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Admin</span>
              <span className="text-[10px] font-bold text-[#e62e04] uppercase tracking-widest">Dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>
          
          <div className="h-8 w-px bg-gray-200 dark:border-slate-800" />
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Home size={16} />
            <span className="hidden sm:inline">View Store</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 sm:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 overflow-hidden 
          fixed sm:sticky top-16 h-[calc(100vh-64px)] z-40
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full sm:w-20 sm:translate-x-0'}
        `}>
          <div className="flex flex-col h-full py-4 w-64">
            <nav className="flex-1 px-3 space-y-1">
              <AdminNavLink to="/admin" icon={<BarChart3 size={20} />} label="Dashboard" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
              <AdminNavLink to="/admin?tab=products" icon={<Package size={20} />} label="Products" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
              <AdminNavLink to="/admin?tab=orders" icon={<ShoppingCart size={20} />} label="Orders" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
              <AdminNavLink to="/admin?tab=categories" icon={<Layers size={20} />} label="Categories" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
              <AdminNavLink to="/admin?tab=landing" icon={<Globe size={20} />} label="Landing Page" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
              <AdminNavLink to="/admin?tab=settings" icon={<Settings size={20} />} label="Settings" collapsed={!isSidebarOpen} onClick={() => window.innerWidth < 640 && setIsSidebarOpen(false)} />
            </nav>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
                  <ShieldAlert size={16} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black text-gray-900 dark:text-white truncate">Administrator</span>
                    <span className="text-[10px] text-gray-500 truncate">System Access</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface AdminNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({ to, icon, label, collapsed, onClick }) => {
  const location = useLocation();
  
  // Custom isActive check for query params
  const isActive = React.useMemo(() => {
    const toUrl = new URL(to, window.location.origin);
    const toTab = toUrl.searchParams.get('tab') || 'dashboard';
    
    const currentParams = new URLSearchParams(location.search);
    const currentTab = currentParams.get('tab') || 'dashboard';
    
    return toTab === currentTab;
  }, [to, location.search]);

  return (
    <NavLink 
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
        ${isActive 
          ? 'bg-red-50 dark:bg-red-950/20 text-[#e62e04]' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'}
      `}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {!collapsed && (
        <span className="text-sm font-bold truncate">{label}</span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default AdminLayout;
