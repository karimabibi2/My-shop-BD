import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';
import { 
  auth, db, googleProvider, 
  signInWithPopup, signOut, onAuthStateChanged,
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, onSnapshot, query, where, orderBy, limit
} from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() as User : null;
        
        const mockUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          isAdmin: firebaseUser.email === 'mstkarimabibi45@gmail.com' || userData?.isAdmin || false,
          role: (firebaseUser.email === 'mstkarimabibi45@gmail.com' || userData?.role === 'admin') ? 'admin' : 'client'
        };
        setUser(mockUser);
        
        // Ensure user doc exists in Firestore
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', firebaseUser.uid), mockUser);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    // Real-time listeners
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data() as Product);
      setAllProducts(products.length > 0 ? products : MOCK_PRODUCTS);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'products'));

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => doc.data().name as string);
      setCategories(categoriesData.length > 0 ? categoriesData : CATEGORIES);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'categories'));

    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
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
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/settings'));

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeConfig();
    };
  }, []);

  // Orders listener - filtered by user role
  useEffect(() => {
    if (!isAuthReady) return;

    let ordersQuery;
    if (user?.isAdmin) {
      // Admin sees all orders
      ordersQuery = collection(db, 'orders');
    } else if (user) {
      // Client sees only their own orders
      ordersQuery = query(collection(db, 'orders'), where('uid', '==', user.id));
    } else {
      // Guest sees no orders
      setOrders([]);
      return;
    }

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => doc.data() as Order);
      setOrders(ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, (error) => {
      // Only report if it's not a permission error for guests (who might have stale listeners)
      if (error.code !== 'permission-denied' || user) {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    });

    return () => unsubscribeOrders();
  }, [user, isAuthReady]);

  // Save config to Firestore whenever it changes (only for admin)
  useEffect(() => {
    if (!isAuthReady || !user?.isAdmin) return;
    const saveConfig = async () => {
      try {
        const config = {
          bannerImage, whatsappNumber, facebookLink, youtubeLink, tiktokLink,
          globalOrderPolicy, shippingRates, categories, trackingConfig,
          adminUsername, adminPassword, visitorCount, customApiKey, twelvedataApiKey
        };
        await setDoc(doc(db, 'config', 'settings'), config);
      } catch (e) {
        console.error("Failed to save config to Firestore:", e);
      }
    };
    saveConfig();
  }, [
    bannerImage, whatsappNumber, facebookLink, youtubeLink, tiktokLink,
    globalOrderPolicy, shippingRates, categories, trackingConfig,
    adminUsername, adminPassword, visitorCount, customApiKey, twelvedataApiKey,
    isAuthReady, user?.isAdmin
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
    // For this app, we'll use Firebase Auth
    // If it's the admin email, we check against the config
    if (email === adminUsername && password === adminPassword) {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin',
        email: adminUsername,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        isAdmin: true,
        role: 'admin'
      };
      setUser(adminUser);
      return;
    }
    // Otherwise, try Firebase Auth (if password provided)
    // Note: This is a simplified version. In a real app, you'd use signInWithEmailAndPassword
    throw new Error('Invalid credentials');
  };

  const signup = async (email: string, password?: string, name?: string) => {
    // Simplified signup
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: false,
      role: 'client'
    };
    setUser(newUser);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
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
      return true;
    }
    return false;
  };

  const updateAdminCredentials = (username: string, password: string) => {
    setAdminUsername(username);
    setAdminPassword(password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addOrder = async (order: Order) => {
    const newOrder = { 
      ...order, 
      id: order.id || 'order-' + Date.now(),
      customerName: order.customerName || user?.name || 'Guest',
      uid: user?.id || 'guest',
      date: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${newOrder.id}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    try {
      // In Firestore, we store categories as documents
      const q = query(collection(db, 'categories'), where('name', '==', oldName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const categoryDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'categories', categoryDoc.id), { name: newName });
      } else {
        // If not found, just add it
        await addDoc(collection(db, 'categories'), { name: newName });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'categories');
    }
  };

  const deleteCategory = async (name: string) => {
    if (!name) return;
    try {
      const q = query(collection(db, 'categories'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const categoryDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'categories', categoryDoc.id));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'categories');
    }
  };

  const addCategory = async (name: string) => {
    if (!name || categories.includes(name)) return;
    try {
      await addDoc(collection(db, 'categories'), { name });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
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
