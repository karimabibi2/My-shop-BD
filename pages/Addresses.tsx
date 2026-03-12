
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { MapPin, Plus, Trash2, ArrowLeft, Home, Building, Building2, Map, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BD_LOCATIONS } from '../constants';

const Addresses: React.FC = () => {
  const { addresses, addAddress, removeAddress, user } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: user?.name || '',
    phone: '',
    details: '',
    district: '',
    thana: ''
  });

  const districts = Object.keys(BD_LOCATIONS).sort();
  const thanas = formData.district ? BD_LOCATIONS[formData.district].sort() : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.details || !formData.district || !formData.thana) {
      alert("Please fill all fields including District and Thana");
      return;
    }

    addAddress({
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    });
    setShowAddForm(false);
    setFormData({ ...formData, phone: '', details: '', district: '', thana: '' });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      district: e.target.value,
      thana: '' // Reset thana when district changes
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-5 py-5 px-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Saved Addresses</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`p-2 rounded-xl transition-all ${showAddForm ? 'bg-gray-100 dark:bg-slate-800 text-gray-500' : 'bg-[#e62e04] text-white shadow-lg shadow-red-100 dark:shadow-none'}`}
          >
            {showAddForm ? <ArrowLeft size={20} className="rotate-90" /> : <Plus size={20} />}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-4 duration-300 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Label</label>
              <div className="flex gap-2">
                {['Home', 'Office', 'Other'].map(l => (
                  <button 
                    key={l}
                    type="button"
                    onClick={() => setFormData({...formData, label: l})}
                    className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      formData.label === l 
                      ? 'bg-[#e62e04] text-white border-transparent' 
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 border-transparent'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-xs dark:text-white transition-all"
                  placeholder="Name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-xs dark:text-white transition-all"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">District (Jela)</label>
              <div className="relative">
                <select 
                  required
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-xs dark:text-white appearance-none transition-all"
                >
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thana / Upazila</label>
              <div className="relative">
                <select 
                  required
                  disabled={!formData.district}
                  value={formData.thana}
                  onChange={(e) => setFormData({...formData, thana: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-xs dark:text-white appearance-none transition-all disabled:opacity-50"
                >
                  <option value="">Select Thana</option>
                  {thanas.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Address Details</label>
              <textarea 
                required
                rows={2}
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-xs dark:text-white transition-all"
                placeholder="House #, Road #, Area..."
              />
            </div>

            <button type="submit" className="w-full bg-[#e62e04] text-white py-3.5 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all text-[11px] mt-2">
              Save Delivery Address
            </button>
          </form>
        )}

        {/* Address List */}
        <div className="flex flex-col gap-3 pb-10">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-start gap-4 group transition-all hover:border-gray-200 dark:hover:border-slate-700">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#e62e04] flex-shrink-0">
                {addr.label === 'Home' ? <Home size={20} /> : addr.label === 'Office' ? <Building size={20} /> : <MapPin size={20} />}
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#e62e04] uppercase tracking-widest">{addr.label}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-[11px] font-bold text-gray-800 dark:text-white">{addr.fullName}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 mt-1">{addr.thana}, {addr.district}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{addr.details}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">{addr.phone}</p>
              </div>
              <button 
                onClick={() => removeAddress(addr.id)}
                className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {addresses.length === 0 && !showAddForm && (
            <div className="py-20 flex flex-col items-center text-center px-10">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-700 mb-4">
                <MapPin size={32} />
              </div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No delivery addresses saved yet.</p>
              <button onClick={() => setShowAddForm(true)} className="mt-4 text-[#e62e04] text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900 px-6 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20">
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Addresses;
