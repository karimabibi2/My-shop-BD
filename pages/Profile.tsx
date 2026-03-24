
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Package, MapPin, User as UserIcon, LogOut, ChevronRight, 
  Mail, Settings, Lock, ShieldCheck, ArrowRight, RefreshCw, 
  CheckCircle2, XCircle, Image as ImageIcon, Globe 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, login, signup, logout, orders, addresses, updateUser, isAuthReady, signInWithGoogle, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newAvatar, setNewAvatar] = useState(user?.avatar || '');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError(t('enter_email_password'));
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        await signup(email, password, email.split('@')[0]);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = t('auth_error_default');
      
      const errorCode = error.code || (error.message && error.message.includes('auth/') ? error.message.match(/auth\/[a-z-]+/)?.[0] : null);

      if (errorCode === 'auth/email-already-in-use') {
        message = t('auth_error_email_in_use');
      } else if (errorCode === 'auth/invalid-email') {
        message = t('auth_error_invalid_email');
      } else if (errorCode === 'auth/weak-password') {
        message = t('auth_error_weak_password');
      } else if (errorCode === 'auth/user-not-found') {
        message = t('auth_error_user_not_found');
      } else if (errorCode === 'auth/wrong-password') {
        message = t('auth_error_wrong_password');
      } else if (errorCode === 'auth/too-many-requests') {
        message = t('auth_error_too_many_requests');
      } else if (error.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error) message = parsed.error;
          else message = error.message;
        } catch {
          message = error.message;
        }
      }
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google Sign-in error:", error);
      setAuthError(error.message || t('google_signin_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError(t('reset_password_email_required'));
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      await resetPassword(email);
      setAuthError(t('reset_password_success'));
    } catch (error: any) {
      console.error("Reset password error:", error);
      setAuthError(t('reset_password_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateUser(newName, newAvatar);
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setIsLoading(false);
    setAuthError(null);
  };

  if (!isAuthReady) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="animate-spin text-[#e62e04]" size={40} />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col gap-6 py-8 px-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
              {t('my_account')}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {t('direct_sourcing')}
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
                {t('login')}
              </button>
              <button 
                onClick={() => resetForm('signup')}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'signup' 
                  ? 'text-[#e62e04] border-b-2 border-[#e62e04]' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
              >
                {t('signup')}
              </button>
            </div>

            <form onSubmit={handleAuth} className="p-6 flex flex-col gap-5">
              {authError && (
                <div className={`${
                  authError.includes('পাঠানো হয়েছে') 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-600' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600'
                } border p-3 rounded-xl flex items-center gap-3 animate-shake`}>
                  {authError.includes('পাঠানো হয়েছে') ? <RefreshCw size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                  <span className="text-[10px] font-bold uppercase tracking-wider">{authError}</span>
                </div>
              )}
              <div className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 focus:border-[#e62e04] focus:ring-0 text-sm dark:text-white transition-all"
                      placeholder="example@gmail.com"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('password')}</label>
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
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="text-[10px] font-bold text-[#e62e04] hover:underline uppercase tracking-wider disabled:opacity-50"
                    >
                      {t('forgot_password')}
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
                    {activeTab === 'login' ? t('secure_login') : t('create_account')}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 leading-relaxed">
                {t('trusted_network')}
              </p>
            </form>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{t('connect_with')}</p>
            <div className="flex gap-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex-1 py-3 border border-gray-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs font-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
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
          <div className="relative flex-shrink-0">
            <img 
              src={user.avatar} 
              referrerPolicy="no-referrer" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
              }}
              className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm aspect-square" 
              alt="User" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{user.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{user.email}</p>
            <button 
              onClick={() => {
                setNewName(user.name);
                setNewAvatar(user.avatar);
                setIsEditing(true);
              }}
              className="mt-1 text-[9px] font-black text-[#e62e04] uppercase tracking-widest hover:underline"
            >
              {t('edit_profile')}
            </button>
          </div>
          <button onClick={logout} className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-950/40">
            <LogOut size={20} />
          </button>
        </div>

        {/* Admin Access - Only for Admins */}
        {user.isAdmin && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-[0.2em] ml-1 mb-1">{t('administrative_access')}</h4>
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center justify-between p-5 bg-gradient-to-r from-[#e62e04] to-red-500 text-white rounded-2xl shadow-lg shadow-red-100 dark:shadow-none hover:scale-[1.02] transition-all border border-red-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center border border-white/30">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-black text-[15px] uppercase italic tracking-tighter">{t('admin_panel')}</span>
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">{t('manage_store_settings')}</span>
                </div>
              </div>
              <ArrowRight size={20} />
            </button>

            <a 
              href="https://my-shop-bd.vercel.app/#/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-slate-900 border-2 border-red-50 dark:border-red-950/20 rounded-2xl text-[11px] font-black text-[#e62e04] uppercase tracking-[0.2em] shadow-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <Globe size={18} />
              {t('visit_live_dashboard')}
            </a>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1 mb-1">{t('activity_settings')}</h4>
          
          {user.isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">{t('admin_panel')}</span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('management_access')}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </button>
          )}

          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                <Package size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">{t('my_orders')}</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{orders.length} {t('shipments')}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                <UserIcon size={20} />
              </div>
              <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">{t('personal_info')}</span>
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
                <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">{t('delivery_addresses')}</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{addresses.length} {t('locations')}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>

          {user.isAdmin && (
            <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 text-gray-500 rounded-xl flex items-center justify-center border border-gray-200 dark:border-slate-700">
                  <Settings size={20} />
                </div>
                <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200">{t('store_settings')}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </button>
          )}
        </div>

        <div className="mt-6">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-50 dark:border-red-950/20 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut size={16} />
            {t('sign_out')}
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#e62e04] italic">{t('update_profile')}</h3>
                <button onClick={() => setIsEditing(false)} className="p-1 text-gray-400 hover:text-gray-800">
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="relative group flex-shrink-0">
                    <img 
                      src={newAvatar} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-slate-800 shadow-md aspect-square"
                      alt="Preview"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
                      }}
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <ImageIcon size={24} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('tap_to_change')}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{t('display_name')}</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3.5 px-4 focus:border-[#e62e04] focus:ring-0 text-sm dark:text-white font-bold"
                    placeholder="Your Name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{t('avatar_url')}</label>
                  <input 
                    type="text" 
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl py-3 px-4 focus:border-[#e62e04] focus:ring-0 text-[10px] dark:text-gray-300"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none mt-2 text-xs"
                >
                  {t('save_changes')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
