import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product, Category, LandingConfig } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  orders: Order[];
  allProducts: Product[];
  categories: Category[];
  addresses: Address[];
  shippingRates: Record<string, number>;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateCategory: (oldName: string, newName: string, image?: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
  addCategory: (name: string, image?: string) => Promise<void>;
  updateCategoryImage: (categoryName: string, image: string) => Promise<void>;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateShippingRates: (rates: Record<string, number>) => Promise<void>;
  updateUser: (name: string, avatar: string) => void;
  syncProducts: () => void;
  syncCategories: () => void;
  bannerImage: string;
  updateBannerImage: (image: string) => Promise<void>;
  paymentMethodsImage: string;
  updatePaymentMethodsImage: (image: string) => Promise<void>;
  whatsappNumber: string;
  updateWhatsappNumber: (number: string) => Promise<void>;
  bkashNumber: string;
  updateBkashNumber: (number: string) => Promise<void>;
  nagadNumber: string;
  updateNagadNumber: (number: string) => Promise<void>;
  rocketNumber: string;
  updateRocketNumber: (number: string) => Promise<void>;
  facebookLink: string;
  updateFacebookLink: (link: string) => Promise<void>;
  youtubeLink: string;
  updateYoutubeLink: (link: string) => Promise<void>;
  tiktokLink: string;
  updateTiktokLink: (link: string) => Promise<void>;
  adminUsername: string;
  adminPassword: string;
  updateAdminCredentials: (username: string, password: string) => Promise<void>;
  globalOrderPolicy: string;
  updateGlobalOrderPolicy: (policy: string) => Promise<void>;
  trackingConfig: TrackingConfig;
  updateTrackingConfig: (config: TrackingConfig) => Promise<void>;
  clearTrackingLogs: () => void;
  visitorCount: number;
  trackingLogs: any[];
  customApiKey: string;
  updateCustomApiKey: (key: string) => Promise<void>;
  isPromoBannerEnabled: boolean;
  updatePromoBannerEnabled: (enabled: boolean) => Promise<void>;
  isDarkModeDefault: boolean;
  updateDarkModeDefault: (enabled: boolean) => Promise<void>;
  landingConfig: LandingConfig;
  updateLandingConfig: (config: LandingConfig) => Promise<void>;
  uploadImage: (file: File | Blob, path: string, onProgress?: (progress: number) => void) => Promise<string>;
  isAuthReady: boolean;
  isDataReady: boolean;
  toast: typeof toast;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isPromoBannerEnabled, setIsPromoBannerEnabled] = useState<boolean>(true);
  const [isDarkModeDefault, setIsDarkModeDefault] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>(DELIVERY_RATES);
  const [bannerImage, setBannerImage] = useState<string>('');
  const [paymentMethodsImage, setPaymentMethodsImage] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('8801304881109');
  const [bkashNumber, setBkashNumber] = useState<string>('8801304881109');
  const [nagadNumber, setNagadNumber] = useState<string>('8801304881109');
  const [rocketNumber, setRocketNumber] = useState<string>('8801304881109');
  const [facebookLink, setFacebookLink] = useState<string>('https://facebook.com');
  const [youtubeLink, setYoutubeLink] = useState<string>('https://youtube.com');
  const [tiktokLink, setTiktokLink] = useState<string>('https://tiktok.com');
  const [adminUsername, setAdminUsername] = useState<string>('Niloyshop');
  const [adminPassword, setAdminPassword] = useState<string>('Niloyshop12#');
  const [globalOrderPolicy, setGlobalOrderPolicy] = useState<string>('Cash on delivery available all over Bangladesh.\nDelivery within 24-48 hours inside Dhaka.\n7 days easy return policy if product is damaged.\nCheck the product before paying the delivery man.');
  const [trackingConfig, setTrackingConfig] = useState<TrackingConfig>({
    fbPixelId: '',
    fbCapiToken: '',
    fbTestEventCode: '',
    tiktokPixelId: '',
    gtmId: '',
    ga4Id: '',
    customScripts: '',
    isEnabled: false,
  });

  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [landingConfig, setLandingConfig] = useState<LandingConfig>({
    featuredProductId: '',
    description: '',
    orderPolicy: '',
    faqs: [],
    reviews: []
  });
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, configRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/config'),
          fetch('/api/orders')
        ]);

        let products = await productsRes.json();
        let categoriesData = await categoriesRes.json();
        const config = await configRes.json();
        const ordersData = await ordersRes.json();

        if (products.length === 0) {
          await fetch('/api/seed', { method: 'POST' });
          const pRes = await fetch('/api/products');
          const cRes = await fetch('/api/categories');
          products = await pRes.json();
          categoriesData = await cRes.json();
        }

        setAllProducts(products);
        setCategories(categoriesData);
        setOrders(ordersData);

        if (config) {
          if (config.bannerImage) setBannerImage(config.bannerImage);
          if (config.paymentMethodsImage) setPaymentMethodsImage(config.paymentMethodsImage);
          if (config.whatsappNumber) setWhatsappNumber(config.whatsappNumber);
          if (config.bkashNumber) setBkashNumber(config.bkashNumber);
          if (config.nagadNumber) setNagadNumber(config.nagadNumber);
          if (config.rocketNumber) setRocketNumber(config.rocketNumber);
          if (config.facebookLink) setFacebookLink(config.facebookLink);
          if (config.youtubeLink) setYoutubeLink(config.youtubeLink);
          if (config.tiktokLink) setTiktokLink(config.tiktokLink);
          if (config.globalOrderPolicy) setGlobalOrderPolicy(config.globalOrderPolicy);
          if (config.shippingRates) setShippingRates(config.shippingRates);
          if (config.trackingConfig) setTrackingConfig(config.trackingConfig);
          if (config.adminUsername) setAdminUsername(config.adminUsername);
          if (config.adminPassword) setAdminPassword(config.adminPassword);
          if (config.visitorCount) setVisitorCount(config.visitorCount);
          if (config.customApiKey) setCustomApiKey(config.customApiKey);
          if (config.isPromoBannerEnabled !== undefined) setIsPromoBannerEnabled(config.isPromoBannerEnabled);
          if (config.isDarkModeDefault !== undefined) setIsDarkModeDefault(config.isDarkModeDefault);
        }

        setIsDataReady(true);
        setIsAuthReady(true);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setIsAuthReady(true);
      }
    };

    fetchData();

    // Check for logged in user in localStorage
    const savedUser = localStorage.getItem('shopbd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('shopbd_user', JSON.stringify(userData));
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
  };

  const signup = async (email: string, password?: string, name?: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('shopbd_user', JSON.stringify(userData));
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
  };

  const signInWithGoogle = async () => {
    toast.info('Google Login is currently disabled in this version. Please use email/password.');
  };

  const resetPassword = async (email: string) => {
    toast.info('Password reset is not implemented in this version.');
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await login(email, password);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopbd_user');
  };

  const addOrder = async (order: Order) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...order, uid: user?.id || 'guest' })
    });
    if (res.ok) {
      const newOrder = await res.json();
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const addProduct = async (product: Product) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      const newProduct = await res.json();
      setAllProducts(prev => [...prev, newProduct]);
    }
  };

  const updateProduct = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      setAllProducts(prev => prev.map(p => p.id === product.id ? product : p));
    }
  };

  const deleteProduct = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      setAllProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const addCategory = async (name: string, image?: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image })
    });
    if (res.ok) {
      const newCat = await res.json();
      setCategories(prev => [...prev, newCat]);
    }
  };

  const updateCategory = async (oldName: string, newName: string, image?: string) => {
    const cat = categories.find(c => c.name === oldName);
    if (!cat) return;
    const res = await fetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, image })
    });
    if (res.ok) {
      const updatedCat = await res.json();
      setCategories(prev => prev.map(c => c.id === cat.id ? updatedCat : c));
    }
  };

  const deleteCategory = async (name: string) => {
    const cat = categories.find(c => c.name === name);
    if (!cat) return;
    const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== cat.id));
    }
  };

  const updateCategoryImage = async (categoryName: string, image: string) => {
    await updateCategory(categoryName, categoryName, image);
  };

  const uploadImage = async (file: File | Blob, path: string, onProgress?: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.url);
          } catch (e) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  };

  const updateConfig = async (data: any) => {
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  };

  const updateBannerImage = async (image: string) => {
    if (await updateConfig({ bannerImage: image })) setBannerImage(image);
  };

  const updatePaymentMethodsImage = async (image: string) => {
    if (await updateConfig({ paymentMethodsImage: image })) setPaymentMethodsImage(image);
  };

  const updateWhatsappNumber = async (number: string) => {
    if (await updateConfig({ whatsappNumber: number })) setWhatsappNumber(number);
  };

  const updateBkashNumber = async (number: string) => {
    if (await updateConfig({ bkashNumber: number })) setBkashNumber(number);
  };

  const updateNagadNumber = async (number: string) => {
    if (await updateConfig({ nagadNumber: number })) setNagadNumber(number);
  };

  const updateRocketNumber = async (number: string) => {
    if (await updateConfig({ rocketNumber: number })) setRocketNumber(number);
  };

  const updateFacebookLink = async (link: string) => {
    if (await updateConfig({ facebookLink: link })) setFacebookLink(link);
  };

  const updateYoutubeLink = async (link: string) => {
    if (await updateConfig({ youtubeLink: link })) setYoutubeLink(link);
  };

  const updateTiktokLink = async (link: string) => {
    if (await updateConfig({ tiktokLink: link })) setTiktokLink(link);
  };

  const updateGlobalOrderPolicy = async (policy: string) => {
    if (await updateConfig({ globalOrderPolicy: policy })) setGlobalOrderPolicy(policy);
  };

  const updateShippingRates = async (rates: Record<string, number>) => {
    if (await updateConfig({ shippingRates: rates })) setShippingRates(rates);
  };

  const updateAdminCredentials = async (username: string, password: string) => {
    if (await updateConfig({ adminUsername: username, adminPassword: password })) {
      setAdminUsername(username);
      setAdminPassword(password);
    }
  };

  const syncProducts = async () => {
    for (const p of MOCK_PRODUCTS) {
      await addProduct(p);
    }
    toast.success('Products synced');
  };

  const syncCategories = async () => {
    for (const c of CATEGORIES) {
      await addCategory(c);
    }
    toast.success('Categories synced');
  };

  const addAddress = (address: Address) => setAddresses(prev => [address, ...prev]);
  const removeAddress = (addressId: string) => setAddresses(prev => prev.filter(a => a.id !== addressId));
  const updateUser = (name: string, avatar: string) => user && setUser({ ...user, name, avatar });
  const updateTrackingConfig = async (config: TrackingConfig) => { if (await updateConfig({ trackingConfig: config })) setTrackingConfig(config); };
  const clearTrackingLogs = () => { trackingService.clearLogs(); setTrackingLogs([]); };
  const updateCustomApiKey = async (key: string) => { if (await updateConfig({ customApiKey: key })) setCustomApiKey(key); };
  const updatePromoBannerEnabled = async (enabled: boolean) => { if (await updateConfig({ isPromoBannerEnabled: enabled })) setIsPromoBannerEnabled(enabled); };
  const updateDarkModeDefault = async (enabled: boolean) => { if (await updateConfig({ isDarkModeDefault: enabled })) setIsDarkModeDefault(enabled); };
  const updateLandingConfig = async (config: LandingConfig) => { if (await updateConfig({ landingConfig: config })) setLandingConfig(config); };

  return (
    <AuthContext.Provider value={{ 
      user, orders, allProducts, categories, addresses, shippingRates, bannerImage, paymentMethodsImage, whatsappNumber, 
      bkashNumber, updateBkashNumber, nagadNumber, updateNagadNumber, rocketNumber, updateRocketNumber,
      facebookLink, youtubeLink, tiktokLink,
      login, signup, adminLogin, logout, 
      signInWithGoogle, resetPassword,
      addOrder, updateOrderStatus, updateProduct, deleteProduct, addProduct, updateCategory, deleteCategory, addCategory, updateCategoryImage,
      addAddress, removeAddress, updateShippingRates, updateUser, 
      syncProducts, syncCategories,
      updateBannerImage, updatePaymentMethodsImage, updateWhatsappNumber,
      updateFacebookLink, updateYoutubeLink, updateTiktokLink,
      adminUsername, adminPassword, updateAdminCredentials,
      globalOrderPolicy, updateGlobalOrderPolicy,
      trackingConfig, updateTrackingConfig, clearTrackingLogs, visitorCount, trackingLogs,
      customApiKey, updateCustomApiKey,
      isPromoBannerEnabled, updatePromoBannerEnabled,
      isDarkModeDefault, updateDarkModeDefault,
      landingConfig, updateLandingConfig,
      uploadImage,
      isAuthReady, isDataReady,
      toast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
