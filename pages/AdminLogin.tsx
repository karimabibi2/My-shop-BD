
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ShieldAlert, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = adminLogin(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid administrator credentials');
    }
  };

  return (
    <Layout title="Admin Login">
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-2xl flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/30">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Admin Access</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Restricted Management Area</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl flex items-center gap-3 animate-shake">
                <ShieldAlert size={18} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-600 uppercase">{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#e62e04] outline-none dark:text-white transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#e62e04] outline-none dark:text-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#e62e04] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-[0.98] transition-all mt-4 text-xs"
            >
              Authenticate
            </button>

            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Store
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">Credentials for Demo:</p>
          <p className="text-[9px] font-black text-gray-500 uppercase mt-1 tracking-widest">User: Niloyshop | Pass: Niloyshop12#</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
