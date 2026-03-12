
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, User as UserIcon, LogOut, ChevronRight, Mail, Settings, Lock, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, login, logout, orders, addresses } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      if (!isOtpSent) {
        handleSendCode();
        return;
      }
      if (otp.length !== 6) {
        alert('Please enter the 6-digit Gmail verification code.');
        return;
      }
    }

    setIsLoading(true);
    // Mocking a network delay for login/signup
    setTimeout(() => {
      login(email || 'guest@example.com');
      setIsLoading(false);
    }, 1000);
  };

  const handleSendCode = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid Gmail address first.');
      return;
    }
    
    setIsLoading(true);
    // Mocking sending code via API
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
    }, 1200);
  };

  const resetForm = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setIsOtpSent(false);
    setOtp('');
    setIsLoading(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col gap-6 py-8 px-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
              MY shopBD Account
            </h2>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Direct Sourcing & Secure Access
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
            {/* Login/Signup Tabs */}
            <div className="flex border-b border-gray-100 dark:border-slate-800">
              <button 
                onClick={() => resetForm('login')}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'login' 
                  ? 'text-[#e62e04] border-b-2 border-[#e62e04]' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => resetForm('signup')}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'signup' 
                  ? 'text-[#e62e04] border-b-2 border-[#e62e04]' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleAuth} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                {/* Email Field with inline Send Code button */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gmail Address
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="email" 
                        required
                        disabled={isOtpSent}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 focus:border-[#e62e04] focus:ring-0 text-sm dark:text-white transition-all ${isOtpSent ? 'opacity-60 cursor-not-allowed' : ''}`}
                        placeholder="example@gmail.com"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {activeTab === 'signup' && (
                      <button 
                        type="button"
                        onClick={isOtpSent ? () => setIsOtpSent(false) : handleSendCode}
                        disabled={isLoading && !isOtpSent}
                        className={`px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-center min-w-[90px] border ${
                          isOtpSent 
                          ? 'bg-red-50 dark:bg-red-950/20 text-[#e62e04] border-red-100 dark:border-red-900/30' 
                          : 'bg-[#e62e04] text-white border-transparent hover:bg-[#c42704]'
                        }`}
                      >
                        {isLoading && !isOtpSent ? <RefreshCw className="animate-spin" size={14} /> : (isOtpSent ? 'Change' : 'Send Code')}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Field - "Gmail Verification Code" explicitly below email */}
                {activeTab === 'signup' && (
                  <div className={`flex flex-col gap-1.5 transition-all duration-300 ${isOtpSent ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                        {isOtpSent && <CheckCircle2 size={12} className="text-green-500" />}
                        Gmail Verification Code
                      </label>
                      {isOtpSent && (
                        <button type="button" onClick={handleSendCode} className="text-[9px] font-black text-[#e62e04] uppercase tracking-tighter">
                          RESEND
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={6}
                        required={activeTab === 'signup' && isOtpSent}
                        disabled={!isOtpSent}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-4 pl-11 pr-4 focus:border-green-500 focus:ring-0 text-lg dark:text-white transition-all tracking-[0.5em] font-black"
                        placeholder="000000"
                      />
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {!isOtpSent && activeTab === 'signup' && (
                       <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-right">Send code to enable this field</p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 focus:border-[#e62e04] focus:ring-0 text-sm dark:text-white transition-all"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {activeTab === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-[10px] font-bold text-[#e62e04] hover:underline uppercase tracking-wider">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all text-sm mt-2 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    {activeTab === 'login' ? 'Secure Login' : (isOtpSent ? 'Verify & Create Account' : 'Create Account')}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 leading-relaxed">
                {activeTab === 'signup' && isOtpSent ? 'Check your Gmail inbox for the code' : 'Secure & Trusted Sourcing Network'}
              </p>
            </form>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Connect with</p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 border border-gray-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs font-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                GOOGLE
              </button>
              <button className="flex-1 py-3 border border-gray-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs font-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                FACEBOOK
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 py-6 px-4">
        {/* User Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="relative">
            <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" alt="User" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{user.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{user.email}</p>
          </div>
          <button onClick={logout} className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-950/40">
            <LogOut size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1 mb-1">Activity & Settings</h4>
          
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                <Package size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">My Orders</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{orders.length} Shipments</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                <UserIcon size={20} />
              </div>
              <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">Personal Information</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>
          
          <button 
            onClick={() => navigate('/addresses')}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-xl flex items-center justify-center border border-orange-100 dark:border-orange-900/30">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">Delivery Addresses</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{addresses.length} Locations</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 text-gray-500 rounded-xl flex items-center justify-center border border-gray-200 dark:border-slate-700">
                <Settings size={20} />
              </div>
              <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">Store Settings</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>
        </div>

        <div className="mt-6">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-50 dark:border-red-950/20 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut size={16} />
            Secure Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
