import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';

interface AuthContextType {
  user: User | null;
  orders: Order[];
  allProducts: Product[];
  categories: string[];
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
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addCategory: (name: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateShippingRates: (rates: Record<string, number>) => void;
  updateUser: (name: string, avatar: string) => void;
  syncProducts: () => void;
  syncCategories: () => void;
  bannerImage: string;
  updateBannerImage: (image: string) => void;
  whatsappNumber: string;
  updateWhatsappNumber: (number: string) => void;
  facebookLink: string;
  updateFacebookLink: (link: string) => void;
  youtubeLink: string;
  updateYoutubeLink: (link: string) => void;
  tiktokLink: string;
  updateTiktokLink: (link: string) => void;
  adminUsername: string;
  adminPassword: string;
  updateAdminCredentials: (username: string, password: string) => void;
  globalOrderPolicy: string;
  updateGlobalOrderPolicy: (policy: string) => void;
  trackingConfig: TrackingConfig;
  updateTrackingConfig: (config: TrackingConfig) => void;
  clearTrackingLogs: () => void;
  visitorCount: number;
  trackingLogs: any[];
  customApiKey: string;
  updateCustomApiKey: (key: string) => Promise<void>;
  twelvedataApiKey: string;
  updateTwelvedataApiKey: (key: string) => Promise<void>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>(DELIVERY_RATES);
  const [bannerImage, setBannerImage] = useState<string>('https://picsum.photos/seed/shop/800/400');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('8801304881109');
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
  const [twelvedataApiKey, setTwelvedataApiKey] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage if available
    const savedUser = localStorage.getItem('shopbd_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedProducts = localStorage.getItem('shopbd_products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAllProducts(parsed);
      } else {
        setAllProducts(MOCK_PRODUCTS);
      }
    } else {
      setAllProducts(MOCK_PRODUCTS);
    }
    
    const savedOrders = localStorage.getItem('shopbd_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedCategories = localStorage.getItem('shopbd_categories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCategories(parsed);
      } else {
        setCategories(CATEGORIES);
      }
    } else {
      setCategories(CATEGORIES);
    }

    const savedConfig = localStorage.getItem('shopbd_config');
    if (savedConfig) {
      const data = JSON.parse(savedConfig);
      if (data.bannerImage) setBannerImage(data.bannerImage);
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      if (data.facebookLink) setFacebookLink(data.facebookLink);
      if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
      if (data.tiktokLink) setTiktokLink(data.tiktokLink);
      if (data.globalOrderPolicy) setGlobalOrderPolicy(data.globalOrderPolicy);
      if (data.shippingRates) setShippingRates(data.shippingRates);
      if (data.trackingConfig) setTrackingConfig(data.trackingConfig);
      if (data.adminUsername) setAdminUsername(data.adminUsername);
      if (data.adminPassword) setAdminPassword(data.adminPassword);
      if (data.visitorCount) setVisitorCount(data.visitorCount);
      if (data.customApiKey) setCustomApiKey(data.customApiKey);
      if (data.twelvedataApiKey) setTwelvedataApiKey(data.twelvedataApiKey);
    }

    setIsAuthReady(true);
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthReady) return;
    try {
      const config = {
        bannerImage, whatsappNumber, facebookLink, youtubeLink, tiktokLink,
        globalOrderPolicy, shippingRates, categories, trackingConfig,
        adminUsername, adminPassword, visitorCount, customApiKey, twelvedataApiKey
      };
      localStorage.setItem('shopbd_config', JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save config to localStorage:", e);
    }
  }, [
    bannerImage, whatsappNumber, facebookLink, youtubeLink, tiktokLink,
    globalOrderPolicy, shippingRates, categories, trackingConfig,
    adminUsername, adminPassword, visitorCount, customApiKey, twelvedataApiKey,
    isAuthReady
  ]);

  // Visitor count logic
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('shopbd_visited');
    if (!hasVisited && isAuthReady) {
      setVisitorCount(prev => prev + 1);
      sessionStorage.setItem('shopbd_visited', 'true');
    }
  }, [isAuthReady]);

  // Tracking logs interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingLogs([...trackingService.getLogs()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password?: string) => {
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: email === 'mstkarimabibi45@gmail.com',
      role: email === 'mstkarimabibi45@gmail.com' ? 'admin' : 'client'
    };
    setUser(mockUser);
    localStorage.setItem('shopbd_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password?: string, name?: string) => {
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: email === 'mstkarimabibi45@gmail.com',
      role: email === 'mstkarimabibi45@gmail.com' ? 'admin' : 'client'
    };
    setUser(mockUser);
    localStorage.setItem('shopbd_user', JSON.stringify(mockUser));
  };

  const signInWithGoogle = async () => {
    const mockUser: User = {
      id: 'google-user-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://picsum.photos/seed/google/100/100',
      isAdmin: false,
      role: 'client'
    };
    setUser(mockUser);
    localStorage.setItem('shopbd_user', JSON.stringify(mockUser));
  };

  const resetPassword = async (email: string) => {
    console.log('Password reset email sent to:', email);
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    if (
      (username === adminUsername && password === adminPassword) ||
      (username === 'Amiadmin' && password === 'Amiadmin12#')
    ) {
      const adminUser: User = {
        id: 'admin',
        name: 'Niloy Shop Admin',
        email: 'admin@niloyshop.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niloyshop',
        isAdmin: true,
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('shopbd_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const updateAdminCredentials = (username: string, password: string) => {
    setAdminUsername(username);
    setAdminPassword(password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopbd_user');
  };

  const addOrder = (order: Order) => {
    const newOrder = { 
      ...order, 
      id: 'order-' + Date.now(),
      customerName: order.customerName || user?.name || 'Guest',
      uid: user?.id || 'guest',
      date: new Date().toISOString()
    };
    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    localStorage.setItem('shopbd_orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(newOrders);
    try {
      localStorage.setItem('shopbd_orders', JSON.stringify(newOrders));
    } catch (e) {
      console.error("Failed to save orders to localStorage:", e);
    }
  };

  const updateProduct = async (product: Product) => {
    const newProducts = allProducts.map(p => p.id === product.id ? product : p);
    setAllProducts(newProducts);
    try {
      localStorage.setItem('shopbd_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error("Failed to save products to localStorage:", e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some products or use smaller images.');
      }
      throw e;
    }
  };

  const deleteProduct = async (productId: string) => {
    const newProducts = allProducts.filter(p => p.id !== productId);
    setAllProducts(newProducts);
    try {
      localStorage.setItem('shopbd_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error("Failed to delete product from localStorage:", e);
      throw e;
    }
  };

  const addProduct = async (product: Product) => {
    const newProducts = [product, ...allProducts];
    setAllProducts(newProducts);
    try {
      localStorage.setItem('shopbd_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error("Failed to add product to localStorage:", e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some products or use smaller images.');
      }
      throw e;
    }
  };

  const updateCategory = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    const newCategories = categories.map(c => c === oldName ? newName : c);
    setCategories(newCategories);
  };

  const deleteCategory = (name: string) => {
    if (!name) return;
    const newCategories = categories.filter(c => c !== name);
    if (!newCategories.includes('Uncategorized')) {
      newCategories.push('Uncategorized');
    }
    setCategories(newCategories);
  };

  const addCategory = (name: string) => {
    if (!name || categories.includes(name)) return;
    setCategories([...categories, name]);
  };

  const addAddress = (address: Address) => {
    setAddresses(prev => [address, ...prev]);
  };

  const removeAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
  };

  const updateShippingRates = (rates: Record<string, number>) => {
    setShippingRates(rates);
  };

  const updateUser = (name: string, avatar: string) => {
    if (user) {
      const updatedUser = { ...user, name, avatar };
      setUser(updatedUser);
      localStorage.setItem('shopbd_user', JSON.stringify(updatedUser));
    }
  };

  const syncProducts = () => {
    setAllProducts(MOCK_PRODUCTS);
    localStorage.setItem('shopbd_products', JSON.stringify(MOCK_PRODUCTS));
  };

  const syncCategories = () => {
    setCategories(CATEGORIES);
    localStorage.setItem('shopbd_categories', JSON.stringify(CATEGORIES));
  };

  const updateBannerImage = (image: string) => {
    setBannerImage(image);
  };

  const updateWhatsappNumber = (number: string) => {
    setWhatsappNumber(number);
  };

  const updateFacebookLink = (link: string) => {
    setFacebookLink(link);
  };

  const updateYoutubeLink = (link: string) => {
    setYoutubeLink(link);
  };

  const updateTiktokLink = (link: string) => {
    setTiktokLink(link);
  };

  const updateGlobalOrderPolicy = (policy: string) => {
    setGlobalOrderPolicy(policy);
  };

  const updateTrackingConfig = (config: TrackingConfig) => {
    setTrackingConfig(config);
    trackingService.init(config);
  };

  const clearTrackingLogs = () => {
    trackingService.clearLogs();
    setTrackingLogs([]);
  };

  const updateCustomApiKey = async (key: string) => {
    setCustomApiKey(key);
  };

  const updateTwelvedataApiKey = async (key: string) => {
    setTwelvedataApiKey(key);
  };

  return (
    <AuthContext.Provider value={{ 
      user, orders, allProducts, categories, addresses, shippingRates, bannerImage, whatsappNumber, 
      facebookLink, youtubeLink, tiktokLink,
      login, signup, adminLogin, logout, 
      signInWithGoogle, resetPassword,
      addOrder, updateOrderStatus, updateProduct, deleteProduct, addProduct, updateCategory, deleteCategory, addCategory,
      addAddress, removeAddress, updateShippingRates, updateUser, 
      syncProducts, syncCategories,
      updateBannerImage, updateWhatsappNumber,
      updateFacebookLink, updateYoutubeLink, updateTiktokLink,
      adminUsername, adminPassword, updateAdminCredentials,
      globalOrderPolicy, updateGlobalOrderPolicy,
      trackingConfig, updateTrackingConfig, clearTrackingLogs,
      visitorCount, trackingLogs,
      customApiKey, updateCustomApiKey,
      twelvedataApiKey, updateTwelvedataApiKey,
      isAuthReady
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
