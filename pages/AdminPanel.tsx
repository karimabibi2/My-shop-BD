
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Package, ShoppingCart, Settings, 
  Plus, Edit2, Trash2, CheckCircle, Clock, 
  XCircle, ArrowLeft, Save, Globe, Truck, ShieldAlert,
  Image as ImageIcon, Upload, Link as LinkIcon,
  Layers, MessageCircle, Youtube, Facebook, Lock, Key, FileText,
  Users, Activity, Terminal
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES, DELIVERY_RATES } from '../constants';

import { useLanguage } from '../context/LanguageContext';

const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const { 
    user, orders, allProducts, updateOrderStatus, 
    updateProduct, deleteProduct, addProduct, logout,
    shippingRates, updateShippingRates, categories, updateCategory, deleteCategory, addCategory,
    bannerImage, updateBannerImage, whatsappNumber, updateWhatsappNumber,
    facebookLink, updateFacebookLink, youtubeLink, updateYoutubeLink, tiktokLink, updateTiktokLink,
    adminUsername, adminPassword, updateAdminCredentials,
    globalOrderPolicy, updateGlobalOrderPolicy,
    trackingConfig, updateTrackingConfig,
    visitorCount, trackingLogs,
    customApiKey, updateCustomApiKey,
    twelvedataApiKey, updateTwelvedataApiKey
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'categories'>('dashboard');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Sync activeTab with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['dashboard', 'products', 'orders', 'settings', 'categories'].includes(tab)) {
      setActiveTab(tab as any);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.search]);
  
  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
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
  const [localTracking, setLocalTracking] = useState(trackingConfig);
  const [localApiKey, setLocalApiKey] = useState(customApiKey);
  const [localTwelvedataKey, setLocalTwelvedataKey] = useState(twelvedataApiKey);
  const [hasApiKey, setHasApiKey] = useState(false);

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
      alert("API Key selection is only available within the AI Studio environment.");
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
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
              {activeTab === 'dashboard' && 'Overview'}
              {activeTab === 'products' && 'Inventory'}
              {activeTab === 'orders' && 'Sales Orders'}
              {activeTab === 'categories' && 'Categories'}
              {activeTab === 'settings' && 'Store Settings'}
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
              <span className="text-[10px] font-black text-[#e62e04] uppercase tracking-widest">System Live</span>
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
                onClick={() => setEditingProduct({ id: 'new-' + Date.now(), name: '', price: 0, category: categories[0], isAvailable: true, image: 'https://picsum.photos/400', description: '', orderPolicy: '', sizes: [] })}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {allProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                  <img 
                    src={product.image} 
                    className="w-12 h-12 rounded-lg object-contain bg-gray-50" 
                    referrerPolicy="no-referrer"
                    alt={product.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
                    }}
                  />
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
                      onClick={() => deleteProduct(product.id)} 
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
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
              {categories.map(category => (
                <div key={category} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">{category}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                      {allProducts.filter(p => p.category === category).length} {t('products')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setEditingCategory({ oldName: category, newName: category })}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase"
                    >
                      <Edit2 size={14} /> {t('edit')}
                    </button>
                    <button 
                      onClick={() => {
                        if (category === 'Uncategorized') {
                          alert('The "Uncategorized" category cannot be deleted.');
                          return;
                        }
                        if (window.confirm(`Are you sure you want to delete "${category}"? All products in this category will be moved to "Uncategorized".`)) {
                          deleteCategory(category);
                          alert(`Category "${category}" has been deleted.`);
                        }
                      }}
                      disabled={category === 'Uncategorized'}
                      className={`p-2 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase ${category === 'Uncategorized' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'}`}
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
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Order ID: #{order.id}</span>
                         <h4 className="text-xs font-black text-gray-800 dark:text-white mt-1 uppercase">{order.customerName}</h4>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Payment: {order.paymentMethod || 'COD'}</p>
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
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Ordered Items:</span>
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
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="bg-green-500 text-white p-1.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Mark Delivered
                            </button>
                          )}
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Cancelled')}
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

        {/* --- Settings Tab --- */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#25D366]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">WhatsApp Settings</h4>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase">WhatsApp Number (with country code)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newWhatsappNumber}
                    onChange={(e) => setNewWhatsappNumber(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                    placeholder="e.g. 8801304881109"
                  />
                  <button 
                    onClick={() => {
                      updateWhatsappNumber(newWhatsappNumber);
                      alert(t('whatsapp_updated'));
                    }}
                    className="bg-[#25D366] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    {t('save')}
                  </button>
                </div>
                <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                  This number will be used for all WhatsApp contact buttons on the site.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
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
                onClick={() => {
                  updateShippingRates(rates);
                  alert(t('shipping_rates_updated'));
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
                      onClick={() => {
                        updateFacebookLink(newFacebookLink);
                        alert(t('facebook_link_updated'));
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
                      onClick={() => {
                        updateYoutubeLink(newYoutubeLink);
                        alert(t('youtube_link_updated'));
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
                      onClick={() => {
                        updateTiktokLink(newTiktokLink);
                        alert(t('tiktok_link_updated'));
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
                <button className="w-10 h-5 bg-green-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('dark_mode_default')}</span>
                <button className="w-10 h-5 bg-gray-200 dark:bg-slate-700 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
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
                  Manage your administrative access and security settings.
                </p>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('admin_username')}</label>
                    <input 
                      type="text" 
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="Admin Username"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">{t('admin_password')}</label>
                    <input 
                      type="text" 
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="Admin Password"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (newAdminUser.trim() && newAdminPass.trim()) {
                        updateAdminCredentials(newAdminUser, newAdminPass);
                        alert(t('admin_credentials_updated'));
                      } else {
                        alert(t('empty_credentials_error'));
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
                  <img 
                    src={newBannerUrl} 
                    alt="Banner Preview" 
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://picsum.photos/seed/error/800/400';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded">Preview</span>
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
                      onClick={() => {
                        updateBannerImage(newBannerUrl);
                        alert(t('banner_updated'));
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {t('update')}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Quick Presets:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Sale
                    </button>
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Store
                    </button>
                    <button 
                      onClick={() => setNewBannerUrl('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')}
                      className="text-[8px] font-black text-[#e62e04] uppercase border border-red-100 dark:border-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Fashion
                    </button>
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
                      onClick={() => {
                        updateGlobalOrderPolicy(newGlobalPolicy);
                        alert(t('update_success'));
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
                    onClick={() => {
                      updateTrackingConfig(localTracking);
                      alert(t('tracking_updated'));
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
                        onClick={() => {
                          updateCustomApiKey(localApiKey);
                          alert(t('api_key_saved'));
                        }}
                        className="bg-[#e62e04] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <Save size={12} /> {t('save')}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('twelvedata_api_key')}</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value={localTwelvedataKey}
                        onChange={(e) => setLocalTwelvedataKey(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                        placeholder="Enter Twelvedata API key..."
                      />
                      <button 
                        onClick={() => {
                          updateTwelvedataApiKey(localTwelvedataKey);
                          alert(t('api_key_saved'));
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
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Conversion Dashboard</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Live
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={14} className="text-blue-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">Total Visitors</span>
                    </div>
                    <p className="text-xl font-black">{visitorCount}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart size={14} className="text-orange-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">Total Sales</span>
                    </div>
                    <p className="text-xl font-black">
                      {orders.filter(o => o.status === 'delivered').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 size={14} className="text-purple-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">Conv. Rate</span>
                    </div>
                    <p className="text-xl font-black">
                      {visitorCount > 0 ? ((orders.length / visitorCount) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Package size={14} className="text-green-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">Total Revenue</span>
                    </div>
                    <p className="text-xl font-black">
                      ৳{orders.filter(o => o.status === 'delivered').reduce((acc, curr) => acc + curr.total, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pixel Debug Tool */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-[#e62e04]" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Pixel Debug Tool</h4>
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
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
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
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
                                }}
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
                    onClick={() => {
                      if (editingProduct.id.toString().startsWith('new')) {
                        addProduct({ ...editingProduct, id: 'prod-' + Date.now() });
                      } else {
                        updateProduct(editingProduct);
                      }
                      setEditingProduct(null);
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
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder={t('category_name_placeholder')}
                      autoFocus
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        addCategory(newCategoryName.trim());
                        setNewCategoryName('');
                        setIsAddingCategory(false);
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

                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                    {t('category_update_warning')}
                  </p>

                  <button 
                    onClick={() => {
                      updateCategory(editingCategory.oldName, editingCategory.newName);
                      setEditingCategory(null);
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
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
