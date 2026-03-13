
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Package, ShoppingCart, Settings, 
  Plus, Edit2, Trash2, CheckCircle, Clock, 
  XCircle, ArrowLeft, Save, Globe, Truck, ShieldAlert,
  Image as ImageIcon, Upload, Link as LinkIcon,
  Layers, MessageCircle, Youtube, Facebook, Lock, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DELIVERY_RATES } from '../constants';

const AdminPanel: React.FC = () => {
  const { 
    user, orders, allProducts, updateOrderStatus, 
    updateProduct, deleteProduct, addProduct, logout,
    shippingRates, updateShippingRates, categories, updateCategory, deleteCategory, addCategory,
    bannerImage, updateBannerImage, whatsappNumber, updateWhatsappNumber,
    facebookLink, updateFacebookLink, youtubeLink, updateYoutubeLink, tiktokLink, updateTiktokLink,
    adminUsername, adminPassword, updateAdminCredentials
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'categories'>('dashboard');
  
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
  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState(adminPassword);

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
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <ShieldAlert size={64} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-black uppercase italic">Admin Access Required</h2>
          <p className="text-gray-500 text-sm mt-2">Please log in with administrator credentials to manage the store.</p>
          <div className="flex flex-col w-full gap-3 mt-8">
            <button 
              onClick={() => navigate('/admin/login')} 
              className="bg-[#e62e04] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100"
            >
              Go to Admin Login
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-400 font-black text-[10px] uppercase tracking-widest py-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = {
    totalSales: orders.reduce((acc, o) => acc + o.total, 0),
    totalOrders: orders.length,
    totalProducts: allProducts.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Admin Dashboard</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900">
              <span className="text-[10px] font-black text-[#e62e04] uppercase">Live</span>
            </div>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#e62e04] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {(['dashboard', 'products', 'categories', 'orders', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[70px] py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-1 ${
                activeTab === tab 
                ? 'bg-[#e62e04] text-white' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
              }`}
            >
              {tab === 'dashboard' && <BarChart3 size={16} />}
              {tab === 'products' && <Package size={16} />}
              {tab === 'categories' && <Layers size={16} />}
              {tab === 'orders' && <ShoppingCart size={16} />}
              {tab === 'settings' && <Settings size={16} />}
              {tab}
            </button>
          ))}
        </div>

        {/* --- Dashboard Tab --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Sales</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">৳{stats.totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inventory</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{stats.totalProducts} Items</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pending</span>
              <h3 className="text-lg font-black text-amber-500 mt-1">{stats.pendingOrders} Orders</h3>
            </div>

            <div className="col-span-2 bg-gradient-to-r from-[#e62e04] to-red-400 p-5 rounded-2xl shadow-lg text-white">
              <h4 className="text-sm font-black uppercase italic mb-1">Quick Action</h4>
              <p className="text-[11px] opacity-90 mb-4">Add a new trending product to the store immediately.</p>
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full bg-white text-[#e62e04] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Go to Inventory
              </button>
            </div>
          </div>
        )}

        {/* --- Products Tab --- */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300 pb-10">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Store Inventory</h3>
              <button 
                onClick={() => setEditingProduct({ id: 'new-' + Date.now(), name: '', price: 0, category: categories[0], isAvailable: true, image: 'https://picsum.photos/400', description: '' })}
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
                        {product.isAvailable ? 'In Stock' : 'Out'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Categories List</h3>
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
                      {allProducts.filter(p => p.category === category).length} Products
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setEditingCategory({ oldName: category, newName: category })}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase"
                    >
                      <Edit2 size={14} /> Edit
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
                      <Trash2 size={14} /> Delete
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
             <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest px-1">Customer Orders</h3>
             
             {orders.length === 0 ? (
               <div className="py-20 text-center opacity-40">
                 <ShoppingCart size={48} className="mx-auto mb-3" />
                 <p className="text-[10px] font-bold uppercase">No orders placed yet</p>
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
                      alert('WhatsApp number updated successfully!');
                    }}
                    className="bg-[#25D366] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Update
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
                <h4 className="text-[11px] font-black uppercase tracking-widest">Delivery Settings</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Dhaka Charge</label>
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
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Bogura Charge</label>
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
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Other (Default)</label>
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
                  alert('Shipping rates updated successfully!');
                }}
                className="w-full bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
              >
                <Save size={14} /> Update Shipping Rates
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Social Media Links</h4>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Facebook size={12} className="text-blue-600" />
                    <label className="text-[9px] font-black text-gray-400 uppercase">Facebook Page Link</label>
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
                        alert('Facebook link updated!');
                      }}
                      className="bg-blue-600 text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Youtube size={12} className="text-red-600" />
                    <label className="text-[9px] font-black text-gray-400 uppercase">YouTube Channel Link</label>
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
                        alert('YouTube link updated!');
                      }}
                      className="bg-red-600 text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-black dark:text-white">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13-.08-.26-.17-.38-.26v7.02c0 3.11-1.8 5.54-4.57 6.32-2.33.66-5.13.14-6.77-1.72-1.6-1.81-1.9-4.74-.46-6.78 1.14-1.62 3.16-2.39 5.08-2.09v4.27c-.67-.13-1.39-.14-2.01.23-.72.43-1.18 1.23-1.14 2.06.03.76.46 1.47 1.11 1.81.65.34 1.44.31 2.04-.08.6-.39.91-1.07.92-1.78V.02z"/>
                    </svg>
                    <label className="text-[9px] font-black text-gray-400 uppercase">TikTok Profile Link</label>
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
                        alert('TikTok link updated!');
                      }}
                      className="bg-black text-white px-3 rounded-xl text-[10px] font-black uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Site Visibility</h4>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Promo Banner</span>
                <button className="w-10 h-5 bg-green-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Dark Mode Default</span>
                <button className="w-10 h-5 bg-gray-200 dark:bg-slate-700 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-amber-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Security & Account</h4>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">
                  Manage your administrative access and security settings.
                </p>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Admin Username</label>
                    <input 
                      type="text" 
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-bold dark:text-white"
                      placeholder="Admin Username"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Admin Password</label>
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
                        alert('Admin credentials updated successfully!');
                      } else {
                        alert('Username and Password cannot be empty.');
                      }
                    }}
                    className="bg-[#e62e04] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Update Credentials
                  </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-slate-800 my-2"></div>

                <button 
                  onClick={() => {
                    setShowPasswordModal(true);
                  }}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Key size={14} /> View Current Credentials
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-[#e62e04]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Home Banner Management</h4>
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
                  <label className="text-[9px] font-black text-gray-400 uppercase">Banner Image URL</label>
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
                        alert('Banner image updated successfully!');
                      }}
                      className="bg-[#e62e04] text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Update
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
            </div>
          </div>
        )}

        {/* --- Edit Product Modal --- */}
        {editingProduct && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#e62e04] italic">
                   {editingProduct.id.toString().startsWith('new') ? 'Add New Product' : 'Edit Product'}
                 </h3>
                 <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-gray-800"><ArrowLeft size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Product Name</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder="e.g. Premium Sports Shoes"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Price (৳)</label>
                      <input 
                        type="number" 
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Category</label>
                      <select 
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
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
                    <label htmlFor="avail" className="text-[10px] font-bold text-gray-600 uppercase">Mark as In-Stock</label>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Product Description</label>
                    <textarea 
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white min-h-[80px] resize-none"
                      placeholder="Enter product details..."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Product Image</label>
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
                              <span className="text-[8px] text-gray-400 font-bold uppercase">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-2">
                          <label className="cursor-pointer bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-[#e62e04] transition-colors">
                            <Upload size={16} className="text-gray-400" />
                            <span className="text-[10px] font-black uppercase text-gray-500">Upload Image</span>
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
                          placeholder="Or paste image URL here..."
                        />
                      </div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                        Upload a file or paste a direct link for the product image.
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
                    Save Product Changes
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
                 <h3 className="text-sm font-black uppercase tracking-widest text-green-500 italic">Add Category</h3>
                 <button onClick={() => setIsAddingCategory(false)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Category Name</label>
                    <input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder="e.g. New Collection"
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
                    Add New Category
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
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#e62e04] italic">Edit Category</h3>
                 <button onClick={() => setEditingCategory(null)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Category Name</label>
                    <input 
                      type="text" 
                      value={editingCategory.newName}
                      onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white"
                      placeholder="Enter new name"
                    />
                  </div>

                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1">
                    Changing this will update all products currently in this category.
                  </p>

                  <button 
                    onClick={() => {
                      updateCategory(editingCategory.oldName, editingCategory.newName);
                      setEditingCategory(null);
                    }}
                    className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 mt-2 text-xs"
                  >
                    Update Category Name
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
                 <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 italic">Admin Credentials</h3>
                 <button onClick={() => setShowPasswordModal(false)} className="p-1 text-gray-400 hover:text-gray-800"><XCircle size={20} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Username</span>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{adminUsername}</p>
                      </div>
                      <div className="h-px bg-amber-100 dark:bg-amber-900/30 w-full"></div>
                      <div>
                        <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Password</span>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{adminPassword}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight px-1 text-center">
                    Please keep these credentials safe and do not share them with anyone.
                  </p>

                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full bg-amber-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-amber-100 mt-2 text-xs"
                  >
                    Close
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
