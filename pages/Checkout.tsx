
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { BD_LOCATIONS, DELIVERY_RATES } from '../constants';
import { trackingService } from '../services/TrackingService';

const Checkout: React.FC = () => {
  const { totalPrice: cartTotalPrice, cart: cartItems, clearCart } = useCart();
  const { user, addOrder, addresses, shippingRates, isAuthReady } = useAuth();
  const { t } = useLanguage();

  if (!isAuthReady) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin text-[#e62e04]">
            <CheckCircle size={40} />
          </div>
        </div>
      </Layout>
    );
  }
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;

  const checkoutItems = buyNowProduct ? [{ ...buyNowProduct, quantity: 1 }] : cartItems;
  const checkoutSubtotal = buyNowProduct ? buyNowProduct.price : cartTotalPrice;

  const [isOrdered, setIsOrdered] = useState(false);

  React.useEffect(() => {
    if (checkoutItems.length === 0 && !isOrdered) {
      navigate('/');
    }
  }, [checkoutItems, navigate, isOrdered]);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad'>('COD');
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    details: '',
    district: '',
    thana: ''
  });

  const districts = Object.keys(BD_LOCATIONS).sort();
  const thanas = formData.district ? BD_LOCATIONS[formData.district].sort() : [];

  const currentShipping = useMemo(() => {
    let district = '';
    if (useSavedAddress) {
      district = addresses.find(a => a.id === selectedAddressId)?.district || '';
    } else {
      district = formData.district;
    }

    if (!district) return 0;
    return shippingRates[district] || shippingRates['Default'];
  }, [useSavedAddress, selectedAddressId, formData.district, addresses, shippingRates]);

  const totalPayable = checkoutSubtotal + currentShipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalAddressString = "";
    if (useSavedAddress) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (!addr) return alert("Please select a valid address");
      finalAddressString = `${addr.fullName}, ${addr.phone}, ${addr.details}, ${addr.thana}, ${addr.district}`;
    } else {
      if (!formData.details || !formData.phone || !formData.district || !formData.thana) {
        return alert('Please fill all required delivery fields');
      }
      finalAddressString = `${formData.fullName}, ${formData.phone}, ${formData.details}, ${formData.thana}, ${formData.district}`;
    }
    
    const orderData = {
      id: Math.random().toString(36).substr(2, 9),
      items: checkoutItems,
      total: totalPayable,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      address: finalAddressString,
      customerName: useSavedAddress 
        ? addresses.find(a => a.id === selectedAddressId)?.fullName 
        : formData.fullName,
      phone: useSavedAddress 
        ? addresses.find(a => a.id === selectedAddressId)?.phone 
        : formData.phone,
      paymentMethod
    };

    addOrder(orderData);
    trackingService.trackPurchase(orderData.id, orderData.total, orderData.items);
    
    setIsOrdered(true);
    setTimeout(() => {
      if (!buyNowProduct) {
        clearCart();
      }
      navigate('/orders');
    }, 2500);
  };

  if (isOrdered) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic">{t('order_confirmed')}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('order_success_desc')}</p>
        <div className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('redirecting_orders')}</div>
      </div>
    );
  }

  return (
    <Layout title={t('checkout')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 px-4 pb-20">
        <button onClick={() => navigate(-1)} type="button" className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase mb-2">
          <ArrowLeft size={14} />
          {t('back_to_cart')}
        </button>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">{t('shipping_details')}</h3>
            {addresses.length > 0 && (
              <button 
                type="button" 
                onClick={() => setUseSavedAddress(!useSavedAddress)}
                className="text-[10px] font-black text-[#e62e04] uppercase tracking-tighter border border-red-50 dark:border-red-900/30 px-2 py-1 rounded"
              >
                {useSavedAddress ? t('new_address') : t('use_saved')}
              </button>
            )}
          </div>
          
          {useSavedAddress && addresses.length > 0 ? (
            <div className="flex flex-col gap-3">
              {addresses.map(addr => (
                <label 
                  key={addr.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedAddressId === addr.id 
                    ? 'border-[#e62e04] bg-red-50/30 dark:bg-red-950/10' 
                    : 'border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="address" 
                    className="mt-1 accent-[#e62e04]" 
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-tighter">{addr.label} — {addr.fullName}</span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{addr.details}</p>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{addr.thana}, {addr.district}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('full_name')}</label>
                  <input 
                    required
                    type="text" 
                    className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('mobile_number')}</label>
                  <input 
                    required
                    type="tel" 
                    className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('district')}</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white appearance-none"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value, thana: ''})}
                  >
                    <option value="">{t('select_district')}</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('thana')}</label>
                <div className="relative">
                  <select 
                    required
                    disabled={!formData.district}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white appearance-none disabled:opacity-50"
                    value={formData.thana}
                    onChange={(e) => setFormData({...formData, thana: e.target.value})}
                  >
                    <option value="">{t('select_thana')}</option>
                    {thanas.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('address_details')}</label>
                <textarea 
                  required
                  rows={2}
                  className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white"
                  placeholder={t('street_area')}
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">{t('payment_method')}</h3>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${paymentMethod === 'COD' ? 'border-[#e62e04] bg-red-50/30 dark:bg-red-950/10' : 'border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30'}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black">COD</div>
              <span className="text-[8px] font-black uppercase">{t('cash')}</span>
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('bKash')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${paymentMethod === 'bKash' ? 'border-[#e2136e] bg-pink-50/30 dark:bg-pink-950/10' : 'border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30'}`}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_X-6X7f6X7f6X7X7X7X7X7X7X7X7X7X7X7X7X7&s" alt="bKash" className="w-8 h-8 rounded-lg object-contain" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/bkash/32/32')} />
              <span className="text-[8px] font-black uppercase">bKash</span>
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('Nagad')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${paymentMethod === 'Nagad' ? 'border-[#f7941d] bg-orange-50/30 dark:bg-orange-950/10' : 'border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30'}`}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_X-6X7f6X7f6X7X7X7X7X7X7X7X7X7X7X7X7X7&s" alt="Nagad" className="w-8 h-8 rounded-lg object-contain" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/nagad/32/32')} />
              <span className="text-[8px] font-black uppercase">Nagad</span>
            </button>
          </div>
          {paymentMethod !== 'COD' && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <p className="text-[9px] font-bold text-amber-700 dark:text-amber-500 leading-tight">
                {t('payment_notice')}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider mb-3">{t('order_summary')}</h3>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold">{t('subtotal')}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white">৳{checkoutSubtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold">{t('shipping_charge')}</span>
            {currentShipping > 0 ? (
              <span className="text-sm font-black text-gray-800 dark:text-white">৳{currentShipping.toLocaleString()}</span>
            ) : (
              <span className="text-[10px] font-black text-[#e62e04] uppercase italic">{t('select_address')}</span>
            )}
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-sm font-black text-gray-800 dark:text-white uppercase">{t('total_payable')}</span>
            <span className="text-xl font-black text-[#e62e04]">৳{totalPayable.toLocaleString()}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!useSavedAddress && (!formData.district || !formData.thana)}
          className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-[0.98] transition-all mt-2 text-sm disabled:opacity-50 disabled:grayscale"
        >
          {t('confirm_order')}
        </button>
      </form>
    </Layout>
  );
};

export default Checkout;
