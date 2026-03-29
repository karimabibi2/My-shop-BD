
import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const { user, orders, isAuthReady } = useAuth();
  const { t } = useLanguage();

  if (!isAuthReady) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin text-[#e62e04]">
            <Package size={40} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-20 text-center px-6">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700">
            <Package size={40} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('sign_in_orders')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('track_history')}</p>
          </div>
          <Link to="/profile" className="bg-[#e62e04] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all uppercase tracking-widest text-xs">
            {t('go_to_profile')}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 py-4 px-4">
        <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest px-1">{t('order_history')}</h2>
        
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 text-[#e62e04] rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700">
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-wider">{t('order_id')}{order.id}</h4>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">
                        {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'Pending' 
                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-900/30' 
                    : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-500 border border-green-100 dark:border-green-900/30'
                  }`}>
                    {order.status === 'Pending' ? t('pending') : t('delivered')}
                  </span>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {order.items.map(item => (
                    <div key={item.id} className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white border border-gray-100 dark:border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-contain" 
                          alt={item.name} 
                        />
                      ) : (
                        <ShoppingBag size={14} className="text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('delivery_details')}</span>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white uppercase">{order.customerName}</p>
                    {order.phone && <p className="text-[10px] font-black text-[#e62e04]">{order.phone}</p>}
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">{t('method')}: {order.paymentMethod || 'COD'}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-1 leading-tight">{order.address}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1 pt-3 border-t border-gray-50 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{order.items.length} {t('items_count')}</span>
                  <span className="font-black text-gray-800 dark:text-white text-sm">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-800">
              <ShoppingBag size={40} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('no_orders')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('no_orders_desc')}</p>
            </div>
            <Link to="/" className="bg-[#e62e04] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all uppercase tracking-widest text-xs">
              {t('start_sourcing')}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
