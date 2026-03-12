
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Package, ShoppingCart, Settings, 
  Plus, Edit2, Trash2, CheckCircle, Clock, 
  XCircle, ArrowLeft, Save, Globe, Truck, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DELIVERY_RATES } from '../constants';

const AdminPanel: React.FC = () => {
  const { 
    user, orders, allProducts, updateOrderStatus, 
    updateProduct, deleteProduct, addProduct, logout,
    shippingRates, updateShippingRates 
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  
  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Delivery Rates Local State
  const [rates, setRates] = useState(shippingRates);

  // Sync local rates if context rates change
  useEffect(() => {
    setRates(shippingRates);
  }, [shippingRates]);

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
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          {(['dashboard', 'products', 'orders', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-1 ${
                activeTab === tab 
                ? 'bg-[#e62e04] text-white' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
              }`}
            >
              {tab === 'dashboard' && <BarChart3 size={16} />}
              {tab === 'products' && <Package size={16} />}
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
                onClick={() => setEditingProduct({ id: 'new-' + Date.now(), name: '', price: 0, category: CATEGORIES[0], isAvailable: true, image: 'https://picsum.photos/400', description: '' })}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {allProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                  <img src={product.image} className="w-12 h-12 rounded-lg object-contain bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-gray-800 dark:text-white truncate">{product.name}</h4>
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
                       </div>
                       <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${order.status === 'Pending' ? 'bg-amber-50 text-amber-500' : order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                         {order.status}
                       </div>
                     </div>
                     
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg">
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
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                    <label className="text-[9px] font-black text-gray-400 uppercase">Image URL</label>
                    <input 
                      type="text" 
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-[10px] font-medium dark:text-gray-300"
                    />
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
      </div>
    </Layout>
  );
};

export default AdminPanel;
