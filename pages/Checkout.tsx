
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { BD_LOCATIONS, DELIVERY_RATES } from '../constants';

const Checkout: React.FC = () => {
  const { totalPrice, cart, clearCart } = useCart();
  const { user, addOrder, addresses, shippingRates } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(addresses.length > 0);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || '');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
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

  const totalPayable = totalPrice + currentShipping;

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
    
    addOrder({
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: totalPayable,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      address: finalAddressString
    });
    
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      navigate('/orders');
    }, 2500);
  };

  if (isOrdered) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic">Order Confirmed!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your order has been placed successfully. Thank you for shopping with MY shopBD.</p>
        <div className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Redirecting to your orders...</div>
      </div>
    );
  }

  return (
    <Layout title="Checkout">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 px-4 pb-20">
        <button onClick={() => navigate(-1)} type="button" className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase mb-2">
          <ArrowLeft size={14} />
          Back to Cart
        </button>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">Shipping Details</h3>
            {addresses.length > 0 && (
              <button 
                type="button" 
                onClick={() => setUseSavedAddress(!useSavedAddress)}
                className="text-[10px] font-black text-[#e62e04] uppercase tracking-tighter border border-red-50 dark:border-red-900/30 px-2 py-1 rounded"
              >
                {useSavedAddress ? 'New Address' : 'Use Saved'}
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
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile Number</label>
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">District (Jela)</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white appearance-none"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value, thana: ''})}
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thana / Upazila</label>
                <div className="relative">
                  <select 
                    required
                    disabled={!formData.district}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white appearance-none disabled:opacity-50"
                    value={formData.thana}
                    onChange={(e) => setFormData({...formData, thana: e.target.value})}
                  >
                    <option value="">Select Thana</option>
                    {thanas.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Details</label>
                <textarea 
                  required
                  rows={2}
                  className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#e62e04] outline-none dark:text-white"
                  placeholder="Street, area, etc."
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider mb-3">Order Summary</h3>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Subtotal</span>
            <span className="text-sm font-black text-gray-800 dark:text-white">৳{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Shipping Charge</span>
            {currentShipping > 0 ? (
              <span className="text-sm font-black text-gray-800 dark:text-white">৳{currentShipping.toLocaleString()}</span>
            ) : (
              <span className="text-[10px] font-black text-[#e62e04] uppercase italic">Select Address</span>
            )}
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-sm font-black text-gray-800 dark:text-white uppercase">Total Payable</span>
            <span className="text-xl font-black text-[#e62e04]">৳{totalPayable.toLocaleString()}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!useSavedAddress && (!formData.district || !formData.thana)}
          className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-[0.98] transition-all mt-2 text-sm disabled:opacity-50 disabled:grayscale"
        >
          CONFIRM ORDER
        </button>
      </form>
    </Layout>
  );
};

export default Checkout;
