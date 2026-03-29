
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { 
  BarChart3, Package, ShoppingCart, Settings, 
  Plus, Edit2, Trash2, CheckCircle, Clock, 
  XCircle, ArrowLeft, Save, Globe, Truck, ShieldAlert,
  Image as ImageIcon, Upload, Link as LinkIcon,
  Layers, MessageCircle, Youtube, Facebook, Lock, Key, FileText,
  Users, Activity, Terminal, RefreshCw, Trash, CreditCard, Printer
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { resizeImage } from '../utils/imageUtils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES, DELIVERY_RATES } from '../constants';

import { useLanguage } from '../context/LanguageContext';
import { trackingService } from '../services/TrackingService';

const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const { 
    user, orders, allProducts, updateOrderStatus, 
    updateProduct, deleteProduct, addProduct, logout,
    shippingRates, updateShippingRates, categories, updateCategory, deleteCategory, addCategory,
    syncProducts, syncCategories,
    bannerImage, updateBannerImage, paymentMethodsImage, updatePaymentMethodsImage, whatsappNumber, updateWhatsappNumber,
    bkashNumber, updateBkashNumber, nagadNumber, updateNagadNumber, rocketNumber, updateRocketNumber,
    facebookLink, updateFacebookLink, youtubeLink, updateYoutubeLink, tiktokLink, updateTiktokLink,
    adminUsername, adminPassword, updateAdminCredentials,
    globalOrderPolicy, updateGlobalOrderPolicy,
    trackingConfig, updateTrackingConfig, clearTrackingLogs,
    visitorCount, trackingLogs,
    customApiKey, updateCustomApiKey,
    isPromoBannerEnabled, updatePromoBannerEnabled,
    isDarkModeDefault, updateDarkModeDefault,
    landingConfig, updateLandingConfig,
    isAuthReady,
    toast
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'categories' | 'landing'>('dashboard');

  useEffect(() => {
    if (isAuthReady && (!user || !user.isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, navigate, isAuthReady]);

  // Sync activeTab with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['dashboard', 'products', 'orders', 'settings', 'categories', 'landing'].includes(tab)) {
      setActiveTab(tab as any);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.search]);
  
  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string, image?: string } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<{ name: string, image?: string }>({ name: '', image: '' });
  
  // Delivery Rates Local State
  const [rates, setRates] = useState(shippingRates);
  const [newBannerUrl, setNewBannerUrl] = useState(bannerImage);
  const [newWhatsappNumber, setNewWhatsappNumber] = useState(whatsappNumber);
  const [newFacebookLink, setNewFacebookLink] = useState(facebookLink);
  const [newYoutubeLink, setNewYoutubeLink] = useState(youtubeLink);
  const [newTiktokLink, setNewTiktokLink] = useState(tiktokLink);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState(adminPassword);
  const [newGlobalPolicy, setNewGlobalPolicy] = useState(globalOrderPolicy);
  const [newBkashNumber, setNewBkashNumber] = useState(bkashNumber);
  const [newNagadNumber, setNewNagadNumber] = useState(nagadNumber);
  const [newRocketNumber, setNewRocketNumber] = useState(rocketNumber);
  const [localTracking, setLocalTracking] = useState(trackingConfig);
  const [localApiKey, setLocalApiKey] = useState(customApiKey);
  const [localLandingConfig, setLocalLandingConfig] = useState(landingConfig);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'danger') => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });
  };

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Mitigate race condition: assume success after dialog closes
        setHasApiKey(true);
        
        // Still try to verify if possible
        if ((window as any).aistudio?.hasSelectedApiKey) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        }
      } catch (error) {
        console.error("Error opening key selector:", error);
      }
    } else {
      toast.info("API Key selection is only available within the AI Studio environment.");
    }
  };

  // Sync local rates if context rates change
  useEffect(() => {
    setRates(shippingRates);
  }, [shippingRates]);

  useEffect(() => {
    setNewBannerUrl(bannerImage);
  }, [bannerImage]);

  useEffect(() => {
    setNewWhatsappNumber(whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    setNewFacebookLink(facebookLink);
  }, [facebookLink]);

  useEffect(() => {
    setNewYoutubeLink(youtubeLink);
  }, [youtubeLink]);

  useEffect(() => {
    setNewTiktokLink(tiktokLink);
  }, [tiktokLink]);

  useEffect(() => {
    setNewAdminUser(adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    setNewAdminPass(adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    setNewGlobalPolicy(globalOrderPolicy);
  }, [globalOrderPolicy]);

  useEffect(() => {
    setLocalTracking(trackingConfig);
  }, [trackingConfig]);

  useEffect(() => {
    setLocalLandingConfig(landingConfig);
  }, [landingConfig]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const resized = await resizeImage(base64, 400, 400);
          setEditingProduct({ ...editingProduct, image: resized });
        } catch (error) {
          console.error("Image resize failed:", error);
          setEditingProduct({ ...editingProduct, image: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [showInvoice, setShowInvoice] = useState<Order | null>(null);

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const resized = await resizeImage(base64, 400, 400);
          if (isNew) {
            setNewCategory({ ...newCategory, image: resized });
          } else if (editingCategory) {
            setEditingCategory({ ...editingCategory, image: resized });
          }
        } catch (error) {
          console.error("Image resize failed:", error);
          if (isNew) {
            setNewCategory({ ...newCategory, image: base64 });
          } else if (editingCategory) {
            setEditingCategory({ ...editingCategory, image: base64 });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-slate-800">
          <ShieldAlert size={64} className="text-amber-500 mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase italic text-gray-900 dark:text-white">{t('admin_access_required')}</h2>
          <p className="text-gray-500 text-sm mt-2">{t('admin_access_required_desc')}</p>
          <div className="flex flex-col w-full gap-3 mt-8">
            <button 
              onClick={() => navigate('/admin/login')} 
              className="bg-[#e62e04] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100"
            >
              {t('go_to_admin_login')}
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-400 font-black text-[10px] uppercase tracking-widest py-2"
            >
              {t('back_to_home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalSales: orders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    totalProducts: allProducts.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
              {activeTab === 'dashboard' && t('overview')}
              {activeTab === 'products' && t('inventory')}
              {activeTab === 'orders' && t('sales_orders')}
              {activeTab === 'categories' && t('categories')}
              {activeTab === 'landing' && t('landing_page_settings')}
              {activeTab === 'settings' && t('store_settings')}
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {t('store_management')} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://my-shop-bd.vercel.app/#/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Globe size={14} className="text-[#e62e04]" />
              {t('visit_live_dashboard')}
            </a>
            <div className="bg-red-50 dark:bg-red-950/20 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#e62e04] uppercase tracking-widest">{t('system_live')}</span>
            </div>
          </div>
        </div>

        {/* --- Dashboard Tab --- */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            {/* Mobile Live Link */}
            <a 
              href="https://my-shop-bd.vercel.app/#/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="sm:hidden flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-[11px] font-black text-[#e62e04] uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
            >
              <Globe size={18} />
              {t('visit_live_dashboard')}
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('total_sales')}</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">৳{stats.totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('orders')}</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('inventory')}</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{stats.totalProducts} {t('items_count')}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('pending')}</span>
              <h3 className="text-lg font-black text-amber-500 mt-1">{stats.pendingOrders} {t('orders')}</h3>
            </div>

            {/* Sales Chart */}
            <div className="col-span-1 sm:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('sales_overview')}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{t('last_7_days')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#e62e04] rounded-full" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t('revenue')}</span>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: t('mon'), sales: 4000 },
                    { name: t('tue'), sales: 3000 },
                    { name: t('wed'), sales: 2000 },
                    { name: t('thu'), sales: 2780 },
                    { name: t('fri'), sales: 1890 },
                    { name: t('sat'), sales: 2390 },
                    { name: t('sun'), sales: 3490 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={(value) => `৳${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#e62e04" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#e62e04', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 bg-gradient-to-r from-[#e62e04] to-red-400 p-5 rounded-2xl shadow-lg text-white">
              <h4 className="text-sm font-black uppercase italic mb-1">{t('quick_action')}</h4>
              <p className="text-[11px] opacity-90 mb-4">{t('add_trending_desc')}</p>
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full bg-white text-[#e62e04] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                {t('go_to_inventory')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Products Tab --- */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('store_inventory')}</h3>
              <button 
                onClick={() => setEditingProduct({ 
                  id: 'new-' + Date.now(), 
                  name: '', 
                  price: 0, 
                  rating: 5, 
                  category: categories[0]?.name || 'Uncategorized', 
                  isAvailable: true, 
                  image: 'https://picsum.photos/400', 
                  description: 'এটি একটি প্রিমিয়াম কোয়ালিটি পণ্য। আমাদের প্রতিটি পণ্য অত্যন্ত যত্ন সহকারে তৈরি করা হয় এবং গুণমান নিশ্চিত করা হয়।', 
                  orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ঢাকা সিটির ভিতরে ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। ডেলিভারি সময় ২-৩ কার্যদিবস।', 
                  sizes: [] 
                })}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {categories.map(cat => {
                const category = cat.name;
                const categoryProducts = allProducts.filter(p => p.category === category);
                if (categoryProducts.length === 0) return null;
                return (
                  <div key={cat.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-4 w-1 bg-[#e62e04] rounded-full"></div>
                      <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{category}</h4>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-auto">{categoryProducts.length} Items</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {categoryProducts.map(product => (
                        <div key={product.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                className="w-full h-full object-contain" 
                                referrerPolicy="no-referrer"
                                alt={product.name}
                              />
                            ) : (
                              <Package size={20} className="text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-gray-800 dark:text-white truncate">{product.name}</h4>
                            {product.description && (
                              <p className="text-[8px] text-gray-400 truncate mt-0.5">{product.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black text-[#e62e04]">৳{product.price}</span>
                              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${product.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {product.isAvailable ? t('in_stock') : t('out_of_stock')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingProduct(product)} 
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm shadow-blue-100"
                            >
                              <Edit2 size={12} /> {t('edit')}
                            </button>
                            <button 
                              onClick={() => setEditingProduct(product)} 
                              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm shadow-amber-100"
                            >
                              <FileText size={12} /> {t('order_policy')}
                            </button>
                            <button 
                              onClick={() => {
                                openConfirm(
                                  t('confirm_delete_product') || 'Delete Product?',
                                  t('delete_product_warning') || 'Are you sure you want to delete this product? This action cannot be undone.',
                                  async () => {
                                    try {
                                      await deleteProduct(product.id);
                                      toast.success(t('product_deleted') || 'Product deleted successfully');
                                    } catch (e: any) {
                                      toast.error(e.message || t('failed_to_delete_product') || 'Failed to delete product');
                                    }
                                  }
                                );
                              }} 
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category Wise Image Gallery at the Bottom */}
            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest px-1 mb-6 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#e62e04]" />
                {t('category_gallery')}
              </h3>
              <div className="flex flex-col gap-8">
                {categories.map(cat => {
                  const category = cat.name;
                  const categoryProducts = allProducts.filter(p => p.category === category);
                  if (categoryProducts.length === 0) return null;
                  return (
                    <div key={cat.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-1">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#e62e04] bg-red-50">
                              <ImageIcon size={14} />
                            </div>
                          )}
                        </div>
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{category}</h4>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {categoryProducts.map(product => (
                          <div key={product.id} className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shadow-sm group relative">
                            <div className="w-full h-full flex items-center justify-center">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Package size={16} className="text-gray-300" />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[6px] text-white font-black uppercase text-center px-1">{product.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- Categories Tab --- */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('categories_list')}</h3>
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="text-[#e62e04]">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">{cat.name}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        {allProducts.filter(p => p.category === cat.name).length} {t('products')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setEditingCategory({ oldName: cat.name, newName: cat.name, image: cat.image })}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase"
                    >
                      <Edit2 size={14} /> {t('edit')}
                    </button>
                    <button 
                      onClick={() => {
                        if (cat.name === 'Uncategorized') {
                          toast.error('The "Uncategorized" category cannot be deleted.');
                          return;
                        }
                        openConfirm(
                          t('confirm_delete_category') || 'Delete Category?',
                          t('delete_category_warning') || 'Are you sure you want to delete this category? Products in this category will be moved to Uncategorized.',
                          async () => {
                            try {
                              await deleteCategory(cat.name);
                              toast.success(t('category_deleted') || 'Category deleted successfully');
                            } catch (e) {
                              toast.error(t('failed_to_delete_category') || 'Failed to delete category');
                            }
                          }
                        );
                      }}
                      disabled={cat.name === 'Uncategorized'}
                      className={`p-2 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase ${cat.name === 'Uncategorized' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'}`}
                    >
                      <Trash2 size={14} /> {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Orders Tab --- */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300 pb-10">
             <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest px-1">{t('orders')}</h3>
             
             {orders.length === 0 ? (
               <div className="py-20 text-center opacity-40">
                 <ShoppingCart size={48} className="mx-auto mb-3" />
                 <p className="text-[10px] font-bold uppercase">{t('no_orders')}</p>
               </div>
             ) : (
               <div className="flex flex-col gap-3">
                 {orders.map(order => (
                   <div key={order.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('order_id')}: #{order.id}</span>
                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                           {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <h4 className="text-xs font-black text-gray-800 dark:text-white mt-1 uppercase">{order.customerName}</h4>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('payment')}: {order.paymentMethod || 'COD'}</p>
                          {order.phone && (
                            <p className="text-[10px] font-bold text-[#e62e04] mt-0.5">{order.phone}</p>
                          )}
                       </div>
                       <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${order.status === 'Pending' ? 'bg-amber-50 text-amber-500' : order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                         {order.status}
                       </div>
                     </div>

                     {/* Ordered Product Images */}
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('ordered_items')}:</span>
                       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                         {order.items.map((item, idx) => (
                           <div key={idx} className="relative flex-shrink-0 group">
                             <img 
                               src={item.image} 
                               alt={item.name} 
                               className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shadow-sm"
                               referrerPolicy="no-referrer"
                             />
                             <div className="absolute -top-1 -right-1 flex flex-col gap-0.5 items-end">
                               {item.quantity > 1 && (
                                 <span className="bg-[#e62e04] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                                   {item.quantity}
                                 </span>
                               )}
                               {item.selectedSize && (
                                 <span className="bg-blue-600 text-white text-[7px] font-black px-1 py-0.5 rounded border border-white dark:border-slate-900 shadow-sm">
                                   {item.selectedSize}
                                 </span>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                     
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg">
                       <span className="font-bold text-gray-400 uppercase text-[8px] block mb-1">Delivery Address:</span>
                        {order.address}
                     </div>

                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#e62e04]">Total: ৳{order.total}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowInvoice(order)}
                            className="bg-blue-500 text-white p-1.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"
                          >
                            <FileText size={12} /> Invoice
                          </button>
                          {order.status === 'Pending' && (
                            <button 
                              onClick={async () => {
                                try {
                                  await updateOrderStatus(order.id, 'Delivered');
                                  toast.success(t('order_delivered') || 'Order marked as delivered');
                                } catch (e) {
                                  toast.error(t('failed_to_update_order') || 'Failed to update order');
                                }
                              }}
                              className="bg-green-500 text-white p-1.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Mark Delivered
                            </button>
                          )}
                          <button 
                            onClick={async () => {
                              try {
                                await updateOrderStatus(order.id, 'Cancelled');
                                toast.success(t('order_cancelled') || 'Order cancelled');
                              } catch (e) {
                                toast.error(t('failed_to_update_order') || 'Failed to update order');
                              }
                            }}
                            className="text-red-500 p-1.5 rounded-lg text-[8px] font-black uppercase"
                          >
                            Cancel
                          </button>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* --- Landing Tab --- */}
        {activeTab === 'landing' && (
          <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            {/* Featured Product Selection */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('featured_product')}</h4>
              </div>
              <div className="flex flex-col gap-3">
                <select 
                  value={localLandingConfig.featuredProductId}
                  onChange={(e) => {
                    const productId = e.target.value;
                    const product = allProducts.find(p => p.id === productId);
                    setLocalLandingConfig({
                      ...localLandingConfig, 
                      featuredProductId: productId,
                      // Optionally auto-fill description and order policy if they are empty
                      description: localLandingConfig.description || product?.description || '',
                      orderPolicy: localLandingConfig.orderPolicy || product?.orderPolicy || ''
                    });
                  }}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                >
                  <option value="">{t('select_product')}</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ৳{p.price}</option>
                  ))}
                </select>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">{t('landing_description')}</label>
                  <textarea 
                    value={localLandingConfig.description || ''}
                    onChange={(e) => setLocalLandingConfig({...localLandingConfig, description: e.target.value})}
                    rows={4}
                    className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white resize-none"
                    placeholder={t('description')}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">{t('landing_order_policy')}</label>
                  <textarea 
                    value={localLandingConfig.orderPolicy || ''}
                    onChange={(e) => setLocalLandingConfig({...localLandingConfig, orderPolicy: e.target.value})}
                    rows={4}
                    className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white resize-none"
                    placeholder={t('order_policy')}
                  />
                </div>

                <button 
                  onClick={async () => {
                    try {
                      await updateLandingConfig(localLandingConfig);
                      toast.success(t('landing_config_updated') || 'Landing configuration updated');
                    } catch (e) {
                      toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                    }
                  }}
                  className="w-full bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {t('save_featured_product')}
                </button>
              </div>
            </div>

            {/* FAQs Management */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-blue-500" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t('faqs')}</h4>
                </div>
                <button 
                  onClick={() => {
                    const newFaqs = [...localLandingConfig.faqs, { q: '', a: '' }];
                    setLocalLandingConfig({...localLandingConfig, faqs: newFaqs});
                  }}
                  className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 p-2 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                {localLandingConfig.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl flex flex-col gap-3 relative">
                    <button 
                      onClick={() => {
                        const newFaqs = localLandingConfig.faqs.filter((_, i) => i !== idx);
                        setLocalLandingConfig({...localLandingConfig, faqs: newFaqs});
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('question')} {idx + 1}</label>
                      <input 
                        type="text" 
                        value={faq.q}
                        onChange={(e) => {
                          const newFaqs = [...localLandingConfig.faqs];
                          newFaqs[idx].q = e.target.value;
                          setLocalLandingConfig({...localLandingConfig, faqs: newFaqs});
                        }}
                        className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white"
                        placeholder={t('question_placeholder')}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('answer')} {idx + 1}</label>
                      <textarea 
                        value={faq.a}
                        onChange={(e) => {
                          const newFaqs = [...localLandingConfig.faqs];
                          newFaqs[idx].a = e.target.value;
                          setLocalLandingConfig({...localLandingConfig, faqs: newFaqs});
                        }}
                        rows={2}
                        className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white resize-none"
                        placeholder={t('answer_placeholder')}
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={async () => {
                    try {
                      await updateLandingConfig(localLandingConfig);
                      toast.success(t('landing_config_updated') || 'Landing configuration updated');
                    } catch (e) {
                      toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {t('save_faqs')}
                </button>
              </div>
            </div>

            {/* Reviews Management */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-500" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t('customer_reviews')}</h4>
                </div>
                <button 
                  onClick={() => {
                    const newReviews = [...localLandingConfig.reviews, { name: '', text: '', rating: 5, image: '' }];
                    setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                  }}
                  className="bg-purple-50 dark:bg-purple-950/20 text-purple-600 p-2 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                {localLandingConfig.reviews.map((review, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl flex flex-col gap-3 relative">
                    <button 
                      onClick={() => {
                        const newReviews = localLandingConfig.reviews.filter((_, i) => i !== idx);
                        setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">{t('customer_name')}</label>
                        <input 
                          type="text" 
                          value={review.name}
                          onChange={(e) => {
                            const newReviews = [...localLandingConfig.reviews];
                            newReviews[idx].name = e.target.value;
                            setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                          }}
                          className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">{t('rating')}</label>
                        <input 
                          type="number" 
                          min="1" max="5"
                          value={review.rating}
                          onChange={(e) => {
                            const newReviews = [...localLandingConfig.reviews];
                            newReviews[idx].rating = parseInt(e.target.value);
                            setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                          }}
                          className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('review_text')}</label>
                      <textarea 
                        value={review.text}
                        onChange={(e) => {
                          const newReviews = [...localLandingConfig.reviews];
                          newReviews[idx].text = e.target.value;
                          setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                        }}
                        rows={2}
                        className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('customer_image_url')}</label>
                      <input 
                        type="text" 
                        value={review.image}
                        onChange={(e) => {
                          const newReviews = [...localLandingConfig.reviews];
                          newReviews[idx].image = e.target.value;
                          setLocalLandingConfig({...localLandingConfig, reviews: newReviews});
                        }}
                        className="bg-white dark:bg-slate-900 border-none rounded-lg p-2 text-[10px] font-bold dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={async () => {
                    try {
                      await updateLandingConfig(localLandingConfig);
                      toast.success(t('landing_config_updated') || 'Landing configuration updated');
                    } catch (e) {
                      toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                    }
                  }}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {t('save_reviews')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Settings Tab --- */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#25D366]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('whatsapp_settings')}</h4>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase">{t('whatsapp_number_label')}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newWhatsappNumber}
                    onChange={(e) => setNewWhatsappNumber(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                    placeholder={t('whatsapp_number_placeholder')}
                  />
                  <button 
                    onClick={async () => {
                      try {
                        await updateWhatsappNumber(newWhatsappNumber);
                        toast.success(t('whatsapp_updated') || 'WhatsApp number updated');
                      } catch (e) {
                        toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                      }
                    }}
                    className="bg-[#25D366] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    {t('save')}
                  </button>
                </div>
                <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                  {t('whatsapp_number_desc')}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Payment Methods Settings</h4>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">bKash Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newBkashNumber}
                      onChange={(e) => setNewBkashNumber(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="8801XXXXXXXXX"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateBkashNumber(newBkashNumber);
                          toast.success('bKash number updated');
                        } catch (e) {
                          toast.error('Failed to update bKash number');
                        }
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Nagad Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newNagadNumber}
                      onChange={(e) => setNewNagadNumber(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="8801XXXXXXXXX"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateNagadNumber(newNagadNumber);
                          toast.success('Nagad number updated');
                        } catch (e) {
                          toast.error('Failed to update Nagad number');
                        }
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Rocket Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newRocketNumber}
                      onChange={(e) => setNewRocketNumber(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="8801XXXXXXXXX"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateRocketNumber(newRocketNumber);
                          toast.success('Rocket number updated');
                        } catch (e) {
                          toast.error('Failed to update Rocket number');
                        }
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('data_management')}</h4>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-tight px-1">
                  {t('sync_data_desc')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      openConfirm(
                        t('confirm_sync_products') || 'Sync Products?',
                        t('sync_products_warning') || 'Are you sure you want to sync products from the initial data? This will overwrite existing products with the same IDs.',
                        () => {
                          syncProducts();
                          toast.success(t('products_synced') || 'Products synced successfully');
                        },
                        'warning'
                      );
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30"
                  >
                    <RefreshCw size={14} /> {t('sync_products')}
                  </button>
                  <button 
                    onClick={() => {
                      openConfirm(
                        t('confirm_sync_categories') || 'Sync Categories?',
                        t('sync_categories_warning') || 'Are you sure you want to sync categories from the initial data?',
                        () => {
                          syncCategories();
                          toast.success(t('categories_synced') || 'Categories synced successfully');
                        },
                        'warning'
                      );
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/30"
                  >
                    <RefreshCw size={14} /> {t('sync_categories')}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('landing_page_management')}</h4>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase leading-tight px-1">
                {t('landing_page_management_desc')}
              </p>
              <button 
                onClick={() => setActiveTab('landing')}
                className="w-full bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Edit2 size={14} /> {t('edit_landing_page')}
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('delivery_settings')}</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">{t('dhaka_charge')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">৳</span>
                    <input 
                      type="number" 
                      value={rates.Dhaka}
                      onChange={(e) => setRates({...rates, Dhaka: parseInt(e.target.value)})}
                      className="w-16 bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-1.5 text-center text-xs font-black focus:ring-1 focus:ring-[#e62e04]" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">{t('bogura_charge')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">৳</span>
                    <input 
                      type="number" 
                      value={rates.Bogura}
                      onChange={(e) => setRates({...rates, Bogura: parseInt(e.target.value)})}
                      className="w-16 bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-1.5 text-center text-xs font-black focus:ring-1 focus:ring-[#e62e04]" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">{t('other_charge')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">৳</span>
                    <input 
                      type="number" 
                      value={rates.Default}
                      onChange={(e) => setRates({...rates, Default: parseInt(e.target.value)})}
                      className="w-16 bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-1.5 text-center text-xs font-black focus:ring-1 focus:ring-[#e62e04]" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={async () => {
                  try {
                    await updateShippingRates(rates);
                    toast.success(t('shipping_rates_updated') || 'Shipping rates updated');
                  } catch (e) {
                    toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                  }
                }}
                className="w-full bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
              >
                <Save size={14} /> {t('update_shipping_rates')}
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('social_media_links')}</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Facebook size={12} className="text-blue-600" />
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('facebook_page_link')}</label>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newFacebookLink}
                      onChange={(e) => setNewFacebookLink(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="https://facebook.com/yourpage"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateFacebookLink(newFacebookLink);
                          toast.success(t('facebook_link_updated') || 'Facebook link updated');
                        } catch (e) {
                          toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                        }
                      }}
                      className="bg-blue-600 text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Youtube size={12} className="text-red-600" />
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('youtube_channel_link')}</label>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newYoutubeLink}
                      onChange={(e) => setNewYoutubeLink(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateYoutubeLink(newYoutubeLink);
                          toast.success(t('youtube_link_updated') || 'YouTube link updated');
                        } catch (e) {
                          toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                        }
                      }}
                      className="bg-red-600 text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-black dark:text-white">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13-.08-.26-.17-.38-.26v7.02c0 3.11-1.8 5.54-4.57 6.32-2.33.66-5.13.14-6.77-1.72-1.6-1.81-1.9-4.74-.46-6.78 1.14-1.62 3.16-2.39 5.08-2.09v4.27c-.67-.13-1.39-.14-2.01.23-.72.43-1.18 1.23-1.14 2.06.03.76.46 1.47 1.11 1.81.65.34 1.44.31 2.04-.08.6-.39.91-1.07.92-1.78V.02z"/>
                    </svg>
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('tiktok_profile_link')}</label>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newTiktokLink}
                      onChange={(e) => setNewTiktokLink(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="https://tiktok.com/@yourprofile"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateTiktokLink(newTiktokLink);
                          toast.success(t('tiktok_link_updated') || 'TikTok link updated');
                        } catch (e) {
                          toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                        }
                      }}
                      className="bg-black text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      {t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('site_visibility')}</h4>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('promo_banner')}</span>
                <button 
                  onClick={() => updatePromoBannerEnabled(!isPromoBannerEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isPromoBannerEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isPromoBannerEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('dark_mode_default')}</span>
                <button 
                  onClick={() => updateDarkModeDefault(!isDarkModeDefault)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isDarkModeDefault ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isDarkModeDefault ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-amber-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('security_account')}</h4>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">
                  {t('security_desc')}
                </p>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('admin_username')}</label>
                    <input 
                      type="text" 
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder={t('admin_username')}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('admin_password')}</label>
                    <input 
                      type="text" 
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder={t('admin_password')}
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        if (newAdminUser.trim() && newAdminPass.trim()) {
                          await updateAdminCredentials(newAdminUser, newAdminPass);
                          toast.success(t('admin_credentials_updated') || 'Admin credentials updated');
                        } else {
                          toast.error(t('empty_credentials_error') || 'Username and password cannot be empty');
                        }
                      } catch (e) {
                        toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                      }
                    }}
                    className="bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> {t('update_credentials')}
                  </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-slate-800 my-2"></div>

                <button 
                  onClick={() => {
                    setShowPasswordModal(true);
                  }}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Key size={14} /> {t('view_current_credentials')}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t('home_banner_management')}</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="w-full h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 relative bg-gray-50 dark:bg-slate-800">
                  {newBannerUrl ? (
                    <img 
                      src={newBannerUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded">{t('preview')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">{t('banner_image_url')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newBannerUrl}
                      onChange={(e) => setNewBannerUrl(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="https://example.com/banner.jpg"
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateBannerImage(newBannerUrl);
                          toast.success(t('banner_updated') || 'Banner updated');
                        } catch (e) {
                          toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                        }
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {t('update')}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">{t('quick_presets')}:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      {t('sale')}
                    </button>
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      {t('store')}
                    </button>
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      {t('fashion')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods Image */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{t('payment_method')}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payment Icons/Instructions Image</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <div className="w-full h-32 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                      {paymentMethodsImage ? (
                        <img 
                          src={paymentMethodsImage} 
                          alt="Payment Methods" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">No Image Uploaded</span>
                        </div>
                      )}
                    </div>
                    
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <div className="flex flex-col items-center gap-1 text-white">
                        <Upload size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('upload_image')}</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const resized = await resizeImage(file, 800, 400);
                              updatePaymentMethodsImage(resized);
                              toast.success(t('update_success') || 'Update successful');
                            } catch (err) {
                              toast.error('Failed to upload image');
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const input = document.getElementById('payment-methods-upload') as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                    >
                      <Upload size={14} />
                      {t('upload_new_image')}
                    </button>
                    <input 
                      id="payment-methods-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const resized = await resizeImage(file, 800, 400);
                            updatePaymentMethodsImage(resized);
                            toast.success(t('update_success') || 'Update successful');
                          } catch (err) {
                            toast.error('Failed to upload image');
                          }
                        }
                      }}
                    />
                    {paymentMethodsImage && (
                      <button 
                        onClick={() => updatePaymentMethodsImage('')}
                        className="px-4 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 border border-red-100"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Global Order Policy */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{t('global_order_policy')}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Store-wide Terms & Conditions</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <textarea 
                      value={newGlobalPolicy}
                      onChange={(e) => setNewGlobalPolicy(e.target.value)}
                      rows={5}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white resize-none"
                      placeholder={t('order_policy_placeholder')}
                    />
                    <button 
                      onClick={async () => {
                        try {
                          await updateGlobalOrderPolicy(newGlobalPolicy);
                          toast.success(t('update_success') || 'Update successful');
                        } catch (e) {
                          toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                        }
                      }}
                      className="bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> {t('update')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#e62e04]" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t('tracking_settings')}</h4>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('fb_pixel_id')}</label>
                      <input 
                        type="text" 
                        value={localTracking.fbPixelId}
                        onChange={(e) => setLocalTracking({...localTracking, fbPixelId: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="e.g. 1234567890"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('fb_capi_token')}</label>
                      <input 
                        type="text" 
                        value={localTracking.fbCapiToken}
                        onChange={(e) => setLocalTracking({...localTracking, fbCapiToken: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="EAAB..."
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('fb_test_event_code')}</label>
                      <input 
                        type="text" 
                        value={localTracking.fbTestEventCode}
                        onChange={(e) => setLocalTracking({...localTracking, fbTestEventCode: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="TEST12345"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('tiktok_pixel_id')}</label>
                      <input 
                        type="text" 
                        value={localTracking.tiktokPixelId}
                        onChange={(e) => setLocalTracking({...localTracking, tiktokPixelId: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="e.g. C1234567890"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('gtm_id')}</label>
                      <input 
                        type="text" 
                        value={localTracking.gtmId}
                        onChange={(e) => setLocalTracking({...localTracking, gtmId: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="GTM-XXXXXX"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('ga4_id')}</label>
                      <input 
                        type="text" 
                        value={localTracking.ga4Id}
                        onChange={(e) => setLocalTracking({...localTracking, ga4Id: e.target.value})}
                        className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="G-XXXXXX"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('custom_scripts')}</label>
                      <textarea 
                        value={localTracking.customScripts}
                        onChange={(e) => setLocalTracking({...localTracking, customScripts: e.target.value})}
                        rows={5}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white resize-none"
                        placeholder="<!-- Paste your custom scripts here -->"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input 
                        type="checkbox" 
                        id="trackingEnabled"
                        checked={localTracking.isEnabled}
                        onChange={(e) => setLocalTracking({...localTracking, isEnabled: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-[#e62e04] focus:ring-[#e62e04]"
                      />
                      <label htmlFor="trackingEnabled" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">
                        {t('enable_tracking')}
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      try {
                        await updateTrackingConfig(localTracking);
                        toast.success(t('tracking_updated') || 'Tracking settings updated');
                      } catch (e) {
                        toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                      }
                    }}
                    className="bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> {t('update_tracking')}
                  </button>
                </div>
              </div>

              {/* API Settings */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-[#e62e04]" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t('api_settings')}</h4>
                </div>
                
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                    {t('api_key_notice')}
                  </p>
                  
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gemini API Status</span>
                      <span className={`text-[10px] font-black uppercase ${hasApiKey ? 'text-green-500' : 'text-amber-500'}`}>
                        {hasApiKey ? 'Key Selected' : 'No Key Selected'}
                      </span>
                    </div>
                    <button 
                      onClick={handleOpenKeySelector}
                      className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200 dark:border-slate-600 shadow-sm hover:bg-gray-50 transition-all"
                    >
                      {t('change_api_key')}
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('custom_api_key')}</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value={localApiKey}
                        onChange={(e) => setLocalApiKey(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="Enter your API key here..."
                      />
                      <button 
                        onClick={async () => {
                          try {
                            await updateCustomApiKey(localApiKey);
                            toast.success(t('api_key_saved') || 'API key saved');
                          } catch (e) {
                            toast.error(t('failed_to_update_settings') || 'Failed to update settings');
                          }
                        }}
                        className="bg-[#e62e04] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <Save size={12} /> {t('save')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Conversion Dashboard */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-[#e62e04]" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">{t('conversion_dashboard')}</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {t('live')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={14} className="text-blue-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('total_visitors')}</span>
                    </div>
                    <p className="text-xl font-black">{visitorCount}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart size={14} className="text-orange-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('total_sales')}</span>
                    </div>
                    <p className="text-xl font-black">
                      {orders.filter(o => o.status === 'Delivered').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 size={14} className="text-purple-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('conv_rate')}</span>
                    </div>
                    <p className="text-xl font-black">
                      {visitorCount > 0 ? ((orders.length / visitorCount) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Package size={14} className="text-green-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('total_revenue')}</span>
                    </div>
                    <p className="text-xl font-black">
                      ৳{orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + curr.total, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pixel Debug Tool */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-[#e62e04]" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">{t('pixel_debug_tool')}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        trackingService.trackViewItem(allProducts[0] || { id: 'test', name: 'Test Product', price: 100, category: 'Test' });
                        toast.info('Test event sent! Check logs below.');
                      }}
                      className="text-[9px] font-black uppercase text-blue-500 hover:underline"
                    >
                      Send Test Event
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Clear Tracking Logs',
                          message: 'Are you sure you want to clear all tracking logs?',
                          onConfirm: () => {
                            clearTrackingLogs();
                            toast.success('Tracking logs cleared');
                          }
                        });
                      }}
                      className="text-[9px] font-black uppercase text-red-500 hover:underline"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>
                
                <div className="bg-black rounded-xl p-4 font-mono text-[9px] text-green-400 h-64 overflow-y-auto flex flex-col gap-2">
                  {trackingLogs.length === 0 ? (
                    <p className="text-gray-500 italic">No events tracked yet...</p>
                  ) : (
                    trackingLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-gray-800 pb-2 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-400 font-black uppercase">[{log.platform}]</span>
                          <span className="text-gray-500">{log.timestamp}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-yellow-400 font-bold">{log.event}:</span>
                          <span className="text-gray-300">
                            {typeof log.data === 'object' ? JSON.stringify(log.data) : log.data}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Edit Product Modal --- */}
        {editingProduct && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#e62e04] italic">
                   {editingProduct.id.toString().startsWith('new') ? t('add_new_product') : t('edit_product')}
                 </h3>
                 <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-gray-800"><ArrowLeft size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('product_name')}</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder={t('product_name_placeholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('price')} (৳)</label>
                      <input 
                        type="number" 
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('category')}</label>
                      <select 
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">{t('rating')} (1-5)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="5"
                        step="0.1"
                        value={editingProduct.rating}
                        onChange={(e) => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value)})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('product_sizes')}</label>
                    <input 
                      type="text" 
                      value={editingProduct.sizes?.join(', ') || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder={t('product_sizes_placeholder')}
                    />
                    <div className="flex gap-2 mt-1">
                      {['M', 'L', 'LX'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            const currentSizes = editingProduct.sizes || [];
                            const newSizes = currentSizes.includes(size)
                              ? currentSizes.filter(s => s !== size)
                              : [...currentSizes, size];
                            setEditingProduct({...editingProduct, sizes: newSizes});
                          }}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                            editingProduct.sizes?.includes(size)
                              ? 'bg-[#e62e04] text-white shadow-md shadow-red-100'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          Size {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="avail"
                      checked={editingProduct.isAvailable}
                      onChange={(e) => setEditingProduct({...editingProduct, isAvailable: e.target.checked})}
                      className="accent-[#e62e04]"
                    />
                    <label htmlFor="avail" className="text-[10px] font-bold text-gray-600 uppercase">{t('mark_in_stock')}</label>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('product_description')}</label>
                    <textarea 
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white min-h-[80px] resize-none"
                      placeholder={t('product_desc_placeholder')}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('order_policy')}</label>
                    <textarea 
                      value={editingProduct.orderPolicy || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, orderPolicy: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white min-h-[80px] resize-none"
                      placeholder={t('order_policy_placeholder')}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('product_image')}</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner relative group">
                          {editingProduct.image ? (
                            <>
                              <img 
                                src={editingProduct.image} 
                                alt="Preview" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon size={20} className="text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <ImageIcon size={24} className="text-gray-300" />
                              <span className="text-[8px] text-gray-400 font-bold uppercase">{t('no_image')}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-2">
                          <label className="cursor-pointer bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-[#e62e04] transition-colors">
                            <Upload size={16} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase text-gray-500">{t('upload_image')}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <LinkIcon size={12} />
                        </div>
                        <input 
                          type="text" 
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-9 pr-3 text-[10px] font-medium dark:text-gray-300 focus:ring-1 focus:ring-[#e62e04]"
                          placeholder={t('image_url_placeholder')}
                        />
                      </div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                        {t('image_upload_hint')}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      try {
                        if (editingProduct.id.toString().startsWith('new')) {
                          await addProduct({ ...editingProduct, id: 'prod-' + Date.now() });
                          toast.success(t('product_added') || 'Product added successfully');
                        } else {
                          await updateProduct(editingProduct);
                          toast.success(t('product_updated') || 'Product updated successfully');
                        }
                        setEditingProduct(null);
                      } catch (e: any) {
                        toast.error(e.message || t('failed_to_save_product') || 'Failed to save product');
                      }
                    }}
                    className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 mt-4 text-xs"
                  >
                    {t('save_product_changes')}
                  </button>
               </div>
            </div>
          </div>
        )}
        {/* --- Add Category Modal --- */}
        {isAddingCategory && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-green-500 italic">{t('add_category')}</h3>
                 <button onClick={() => setIsAddingCategory(false)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('category_name')}</label>
                    <input 
                      type="text" 
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder={t('category_name_placeholder')}
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('category_image')}</label>
                    <div className="flex gap-3 items-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {newCategory.image ? (
                          <img src={newCategory.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-300" />
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-green-500 transition-colors">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-[8px] font-black uppercase text-gray-500">{t('upload')}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleCategoryImageUpload(e, true)}
                        />
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      if (newCategory.name.trim()) {
                        try {
                          await addCategory(newCategory.name.trim(), newCategory.image);
                          toast.success(t('category_added') || 'Category added successfully');
                          setNewCategory({ name: '', image: '' });
                          setIsAddingCategory(false);
                        } catch (e) {
                          toast.error(t('failed_to_add_category') || 'Failed to add category');
                        }
                      }
                    }}
                    className="w-full bg-green-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-green-100 mt-2 text-xs"
                  >
                    {t('add_new_category')}
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- Edit Category Modal --- */}
        {editingCategory && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#e62e04] italic">{t('edit_category')}</h3>
                 <button onClick={() => setEditingCategory(null)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('category_name')}</label>
                    <input 
                      type="text" 
                      value={editingCategory.newName}
                      onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder={t('enter_new_name')}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('category_image')}</label>
                    <div className="flex gap-3 items-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {editingCategory.image ? (
                          <img src={editingCategory.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-300" />
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-[#e62e04] transition-colors">
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-[8px] font-black uppercase text-gray-500">{t('upload')}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleCategoryImageUpload(e, false)}
                        />
                      </label>
                    </div>
                  </div>

                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                    {t('category_update_warning')}
                  </p>

                  <button 
                    onClick={async () => {
                      try {
                        await updateCategory(editingCategory.oldName, editingCategory.newName, editingCategory.image);
                        toast.success(t('category_updated') || 'Category updated successfully');
                        setEditingCategory(null);
                      } catch (e) {
                        toast.error(t('failed_to_update_category') || 'Failed to update category');
                      }
                    }}
                    className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 mt-2 text-xs"
                  >
                    {t('update_category_name')}
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- Forgot Password Modal --- */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 italic">{t('admin_credentials')}</h3>
                 <button onClick={() => setShowPasswordModal(false)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">{t('username')}</span>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{adminUsername}</p>
                      </div>
                      <div className="h-px bg-amber-100 dark:bg-amber-900/30 w-full"></div>
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">{t('password')}</span>
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase underline"
                          >
                            {showPassword ? t('hide') : t('show')}
                          </button>
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                          {showPassword ? adminPassword : '••••••••'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1 text-center">
                    {t('credentials_safety_warning')}
                  </p>

                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full bg-amber-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-amber-100 mt-2 text-xs"
                  >
                    {t('close')}
                  </button>
               </div>
            </div>
          </div>
        )}
      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible" id="invoice-content">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-[#e62e04] italic uppercase tracking-tighter">MY shopBD</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Shopping Experience</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black uppercase tracking-tighter">INVOICE</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{showInvoice.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100 dark:border-slate-800">
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill To:</h4>
                  <p className="text-sm font-black uppercase">{showInvoice.customerName}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{showInvoice.address}</p>
                  <p className="text-[10px] font-bold text-[#e62e04]">{showInvoice.phone}</p>
                </div>
                <div className="flex flex-col gap-2 text-right">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details:</h4>
                  <p className="text-[10px] font-bold uppercase"><span className="text-gray-400">Date:</span> {new Date(showInvoice.date).toLocaleDateString()}</p>
                  <p className="text-[10px] font-bold uppercase"><span className="text-gray-400">Payment:</span> {showInvoice.paymentMethod || 'COD'}</p>
                  {(showInvoice as any).transactionId && (
                    <p className="text-[10px] font-bold uppercase text-[#e62e04]"><span className="text-gray-400">Trx ID:</span> {(showInvoice as any).transactionId}</p>
                  )}
                  <p className="text-[10px] font-bold uppercase"><span className="text-gray-400">Status:</span> {showInvoice.status}</p>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                    <th className="py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                    <th className="py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {showInvoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 dark:border-slate-800/50">
                      <td className="py-4">
                        <p className="text-[11px] font-black uppercase tracking-tighter">{item.name}</p>
                        {item.selectedSize && <p className="text-[8px] font-bold text-[#e62e04] uppercase">Size: {item.selectedSize}</p>}
                      </td>
                      <td className="py-4 text-center text-[11px] font-bold">{item.quantity}</td>
                      <td className="py-4 text-right text-[11px] font-bold">৳{item.price.toLocaleString()}</td>
                      <td className="py-4 text-right text-[11px] font-black">৳{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col gap-2 items-end pt-4">
                <div className="flex justify-between w-48 text-[10px] font-bold uppercase">
                  <span className="text-gray-400">Subtotal</span>
                  <span>৳{(showInvoice.total - (shippingRates[showInvoice.address.split(', ').pop() || ''] || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48 text-[10px] font-bold uppercase">
                  <span className="text-gray-400">Shipping</span>
                  <span>৳{(shippingRates[showInvoice.address.split(', ').pop() || ''] || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48 text-sm font-black uppercase pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-[#e62e04]">৳{showInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Thank you for shopping with us!</p>
                <p className="text-[8px] text-gray-300 uppercase">This is a computer generated invoice and does not require a signature.</p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 flex gap-3">
              <button 
                onClick={() => {
                  const content = document.getElementById('invoice-content');
                  if (content) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Invoice - ${showInvoice.id}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                              body { font-family: 'Inter', sans-serif; }
                              @media print {
                                .no-print { display: none; }
                              }
                            </style>
                          </head>
                          <body class="bg-white p-10">
                            ${content.innerHTML}
                            <script>
                              window.onload = () => {
                                window.print();
                                window.onafterprint = () => window.close();
                              }
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }
                }}
                className="flex-1 bg-[#e62e04] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button 
                onClick={() => setShowInvoice(null)}
                className="flex-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        {/* --- Confirmation Modal --- */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
