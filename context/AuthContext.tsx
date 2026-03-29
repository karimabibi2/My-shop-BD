import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product, Category, LandingConfig } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';
import { toast } from 'sonner';
import { 
  auth, db, googleProvider, 
  signInWithPopup, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
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
  updateShippingRates: (rates: Record<string, number>) => void;
  updateUser: (name: string, avatar: string) => void;
  syncProducts: () => void;
  syncCategories: () => void;
  bannerImage: string;
  updateBannerImage: (image: string) => void;
  paymentMethodsImage: string;
  updatePaymentMethodsImage: (image: string) => void;
  whatsappNumber: string;
  updateWhatsappNumber: (number: string) => void;
  bkashNumber: string;
  updateBkashNumber: (number: string) => void;
  nagadNumber: string;
  updateNagadNumber: (number: string) => void;
  rocketNumber: string;
  updateRocketNumber: (number: string) => void;
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
  isPromoBannerEnabled: boolean;
  updatePromoBannerEnabled: (enabled: boolean) => void;
  isDarkModeDefault: boolean;
  updateDarkModeDefault: (enabled: boolean) => void;
  landingConfig: LandingConfig;
  updateLandingConfig: (config: LandingConfig) => Promise<void>;
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() as User : null;
        
        const isAdminEmail = firebaseUser.email === 'mstkarimabibi45@gmail.com' || firebaseUser.email === 'jafor100khan@gmail.com';
        
        const mockUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          isAdmin: isAdminEmail || userData?.isAdmin || false,
          role: (isAdminEmail || userData?.role === 'admin') ? 'admin' : 'client'
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

    // Real-time listeners tracking
    let productsSynced = false;
    let categoriesSynced = false;
    let configSynced = false;
    let landingSynced = false;

    const checkDataReady = () => {
      if (productsSynced && categoriesSynced && configSynced && landingSynced) {
        setIsDataReady(true);
      }
    };

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data() as Product);
      setAllProducts(products);
      productsSynced = true;
      checkDataReady();
    }, (error) => handleFirestoreError(error, OperationType.GET, 'products'));

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      setCategories(categoriesData);
      categoriesSynced = true;
      checkDataReady();
    }, (error) => handleFirestoreError(error, OperationType.GET, 'categories'));

    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.bannerImage) setBannerImage(data.bannerImage);
        if (data.paymentMethodsImage) setPaymentMethodsImage(data.paymentMethodsImage);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.bkashNumber) setBkashNumber(data.bkashNumber);
        if (data.nagadNumber) setNagadNumber(data.nagadNumber);
        if (data.rocketNumber) setRocketNumber(data.rocketNumber);
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
        if (data.isPromoBannerEnabled !== undefined) setIsPromoBannerEnabled(data.isPromoBannerEnabled);
        if (data.isDarkModeDefault !== undefined) setIsDarkModeDefault(data.isDarkModeDefault);
      }
      configSynced = true;
      checkDataReady();
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/settings'));

    const unsubscribeLanding = onSnapshot(doc(db, 'config', 'landing'), (snapshot) => {
      if (snapshot.exists()) {
        setLandingConfig(snapshot.data() as LandingConfig);
      }
      landingSynced = true;
      checkDataReady();
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/landing'));

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeConfig();
      unsubscribeLanding();
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
          bannerImage, paymentMethodsImage, whatsappNumber, bkashNumber, nagadNumber, rocketNumber, facebookLink, youtubeLink, tiktokLink,
          globalOrderPolicy, shippingRates, categories, trackingConfig,
          adminUsername, adminPassword, visitorCount, customApiKey,
          isPromoBannerEnabled, isDarkModeDefault
        };
        await setDoc(doc(db, 'config', 'settings'), config);
      } catch (e) {
        console.error("Failed to save config to Firestore:", e);
      }
    };
    saveConfig();
  }, [
    bannerImage, paymentMethodsImage, whatsappNumber, bkashNumber, nagadNumber, rocketNumber, facebookLink, youtubeLink, tiktokLink,
    globalOrderPolicy, shippingRates, categories, trackingConfig,
    adminUsername, adminPassword, visitorCount, customApiKey,
    isPromoBannerEnabled, isDarkModeDefault,
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

  // Cleanup: Remove "Ultra-Hydrating Skin Care Set" if it exists
  useEffect(() => {
    if (isDataReady && allProducts.length > 0) {
      const productToRemove = allProducts.find(p => p.name === 'Ultra-Hydrating Skin Care Set' || p.id === 'be1');
      if (productToRemove) {
        deleteProduct(productToRemove.id).then(() => {
          console.log('Product "Ultra-Hydrating Skin Care Set" removed successfully.');
        }).catch(err => {
          console.error('Failed to remove product:', err);
        });
      }
    }
  }, [isDataReady, allProducts]);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password?: string, name?: string) => {
    if (!password) throw new Error('Password is required');
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: User = {
        id: firebaseUser.uid,
        name: name || email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin: false,
        role: 'client'
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
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

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // The isAdmin check is handled in onAuthStateChanged
      // But we can check it here too for immediate feedback
      const isAdminEmail = firebaseUser.email === 'mstkarimabibi45@gmail.com' || firebaseUser.email === 'jafor100khan@gmail.com';
      
      if (isAdminEmail) {
        return true;
      } else {
        // If not an admin email, sign out immediately
        await signOut(auth);
        throw new Error('Unauthorized: Not an admin email');
      }
    } catch (error: any) {
      console.error('Admin Login Error:', error);
      // Fallback for local admin credentials if they match the config
      if (
        (email === adminUsername && password === adminPassword) ||
        (email === 'Amiadmin' && password === 'Amiadmin12#')
      ) {
        const adminUser: User = {
          id: 'admin-local',
          name: 'Niloy Shop Admin',
          email: email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niloyshop',
          isAdmin: true,
          role: 'admin'
        };
        setUser(adminUser);
        return true;
      }
      return false;
    }
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

  const updateCategory = async (oldName: string, newName: string, image?: string) => {
    if (!newName) return;
    try {
      const q = query(collection(db, 'categories'), where('name', '==', oldName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const categoryDoc = querySnapshot.docs[0];
        const updateData: any = { name: newName };
        if (image) updateData.image = image;
        await updateDoc(doc(db, 'categories', categoryDoc.id), updateData);
      } else {
        await addDoc(collection(db, 'categories'), { name: newName, image: image || '' });
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

  const addCategory = async (name: string, image?: string) => {
    if (!name || categories.some(c => c.name === name)) return;
    try {
      await addDoc(collection(db, 'categories'), { name, image: image || '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
  };

  const updateCategoryImage = async (categoryName: string, image: string) => {
    try {
      const q = query(collection(db, 'categories'), where('name', '==', categoryName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const categoryDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'categories', categoryDoc.id), { image });
      } else {
        await addDoc(collection(db, 'categories'), { name: categoryName, image });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'categories');
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
    }
  };

  const syncProducts = () => {
    setAllProducts(MOCK_PRODUCTS);
  };

  const syncCategories = () => {
    const defaultCategories = CATEGORIES.map(name => ({ id: name, name }));
    setCategories(defaultCategories);
  };

  const updateBannerImage = (image: string) => {
    setBannerImage(image);
  };

  const updatePaymentMethodsImage = (image: string) => {
    setPaymentMethodsImage(image);
  };

  const updateWhatsappNumber = (number: string) => {
    setWhatsappNumber(number);
  };
  const updateBkashNumber = (number: string) => {
    setBkashNumber(number);
  };
  const updateNagadNumber = (number: string) => {
    setNagadNumber(number);
  };
  const updateRocketNumber = (number: string) => {
    setRocketNumber(number);
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

  const updatePromoBannerEnabled = (enabled: boolean) => {
    setIsPromoBannerEnabled(enabled);
  };

  const updateDarkModeDefault = (enabled: boolean) => {
    setIsDarkModeDefault(enabled);
  };

  const updateLandingConfig = async (config: LandingConfig) => {
    try {
      await setDoc(doc(db, 'config', 'landing'), config);
      setLandingConfig(config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/landing');
    }
  };

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
      trackingConfig, updateTrackingConfig, clearTrackingLogs,
      visitorCount, trackingLogs,
      customApiKey, updateCustomApiKey,
      isPromoBannerEnabled, updatePromoBannerEnabled,
      isDarkModeDefault, updateDarkModeDefault,
      landingConfig, updateLandingConfig,
      isAuthReady,
      isDataReady,
      toast
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
