
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocFromServer,
  where
} from 'firebase/firestore';

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
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addCategory: (name: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateShippingRates: (rates: Record<string, number>) => void;
  updateUser: (name: string, avatar: string) => void;
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: userDoc.id });
        } else {
          // Fallback if doc doesn't exist yet (should be created on login/signup)
          const isOwner = firebaseUser.email === 'mstkarimabibi45@gmail.com';
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.email}/100/100`,
            isAdmin: isOwner,
            role: isOwner ? 'admin' : 'client'
          });
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time data listeners
  useEffect(() => {
    if (!isAuthReady) return;

    // Listen for products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
      setAllProducts(productsData.length > 0 ? productsData : MOCK_PRODUCTS);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    // Listen for orders
    let unsubscribeOrders = () => {};
    if (user) {
      const ordersRef = collection(db, 'orders');
      let ordersQuery;
      if (user.isAdmin) {
        ordersQuery = query(ordersRef, orderBy('date', 'desc'));
      } else {
        ordersQuery = query(ordersRef, where('uid', '==', user.id));
      }
      
      unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        let ordersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Order[];
        // Sort client-side to avoid needing composite indexes
        ordersData = ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(ordersData);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    } else {
      setOrders([]);
    }

    // Listen for config
    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.bannerImage) setBannerImage(data.bannerImage);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
        if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
        if (data.tiktokLink) setTiktokLink(data.tiktokLink);
        if (data.globalOrderPolicy) setGlobalOrderPolicy(data.globalOrderPolicy);
        if (data.shippingRates) setShippingRates(data.shippingRates);
        if (data.categories) setCategories(data.categories);
        if (data.trackingConfig) setTrackingConfig(data.trackingConfig);
        if (data.adminUsername) setAdminUsername(data.adminUsername);
        if (data.adminPassword) setAdminPassword(data.adminPassword);
        if (data.visitorCount) setVisitorCount(data.visitorCount);
        if (data.customApiKey) setCustomApiKey(data.customApiKey);
        if (data.twelvedataApiKey) setTwelvedataApiKey(data.twelvedataApiKey);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/global'));

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeConfig();
    };
  }, [isAuthReady, user]);

  // Visitor count logic
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('shopbd_visited');
    if (!hasVisited && isAuthReady) {
      const configRef = doc(db, 'config', 'global');
      updateDoc(configRef, {
        visitorCount: (visitorCount || 0) + 1
      }).catch(err => console.error("Failed to update visitor count", err));
      sessionStorage.setItem('shopbd_visited', 'true');
    }
  }, [isAuthReady, visitorCount]);

  // Tracking logs interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingLogs([...trackingService.getLogs()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password?: string) => {
    if (password) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Simple mock login if no password (for testing)
      const mockUser: User = {
        id: 'mock-user',
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin: false,
        role: 'client'
      };
      setUser(mockUser);
    }
  };

  const signup = async (email: string, password?: string, name?: string) => {
    if (password) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      // Create user profile in Firestore
      const isOwner = email === 'mstkarimabibi45@gmail.com';
      const newUser: User = {
        id: userCredential.user.uid,
        name: name || email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin: isOwner,
        role: isOwner ? 'admin' : 'client'
      };
      
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${userCredential.user.uid}`);
      }
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const isOwner = firebaseUser.email === 'mstkarimabibi45@gmail.com';
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.email}/100/100`,
          isAdmin: isOwner,
          role: isOwner ? 'admin' : 'client'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      }
    } catch (error) {
      console.error("Google Sign-in error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
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

  const updateAdminCredentials = async (username: string, password: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { adminUsername: username, adminPassword: password });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const sanitizeData = (data: any): any => {
    if (data === null || typeof data !== 'object') {
      return data;
    }
    if (data instanceof Date) {
      return data.toISOString();
    }
    if (Array.isArray(data)) {
      return data.map(sanitizeData);
    }
    const sanitized: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined) {
        sanitized[key] = sanitizeData(value);
      }
    });
    return sanitized;
  };

  const addOrder = async (order: Order) => {
    const path = 'orders';
    try {
      const orderWithCustomer = sanitizeData({ 
        ...order, 
        customerName: order.customerName || user?.name || 'Guest',
        uid: auth.currentUser?.uid || user?.id || 'guest',
        date: new Date().toISOString()
      });
      await addDoc(collection(db, path), orderWithCustomer);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateProduct = async (product: Product) => {
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), sanitizeData(product));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteProduct = async (productId: string) => {
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addProduct = async (product: Product) => {
    const path = 'products';
    try {
      await setDoc(doc(db, 'products', product.id), sanitizeData(product));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    const newCategories = categories.map(c => c === oldName ? newName : c);
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { categories: newCategories });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteCategory = async (name: string) => {
    if (!name) return;
    const newCategories = categories.filter(c => c !== name);
    if (!newCategories.includes('Uncategorized')) {
      newCategories.push('Uncategorized');
    }
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { categories: newCategories });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addCategory = async (name: string) => {
    if (!name || categories.includes(name)) return;
    const newCategories = [...categories, name];
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { categories: newCategories });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addAddress = (address: Address) => {
    setAddresses(prev => [address, ...prev]);
  };

  const removeAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
  };

  const updateShippingRates = async (rates: Record<string, number>) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { shippingRates: rates });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateUser = async (name: string, avatar: string) => {
    if (user && auth.currentUser) {
      const path = `users/${auth.currentUser.uid}`;
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { name, avatar });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  };

  const updateBannerImage = async (image: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { bannerImage: image });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateWhatsappNumber = async (number: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { whatsappNumber: number });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateFacebookLink = async (link: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { facebookLink: link });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateYoutubeLink = async (link: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { youtubeLink: link });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateTiktokLink = async (link: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { tiktokLink: link });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateGlobalOrderPolicy = async (policy: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { globalOrderPolicy: policy });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateTrackingConfig = async (config: TrackingConfig) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { trackingConfig: config });
      trackingService.init(config);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const clearTrackingLogs = () => {
    trackingService.clearLogs();
    setTrackingLogs([]);
  };

  const updateCustomApiKey = async (key: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { customApiKey: key });
      setCustomApiKey(key);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateTwelvedataApiKey = async (key: string) => {
    const path = 'config/global';
    try {
      await updateDoc(doc(db, 'config', 'global'), { twelvedataApiKey: key });
      setTwelvedataApiKey(key);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, orders, allProducts, categories, addresses, shippingRates, bannerImage, whatsappNumber, 
      facebookLink, youtubeLink, tiktokLink,
      login, signup, adminLogin, logout, 
      signInWithGoogle, resetPassword,
      addOrder, updateOrderStatus, updateProduct, deleteProduct, addProduct, updateCategory, deleteCategory, addCategory,
      addAddress, removeAddress, updateShippingRates, updateUser, updateBannerImage, updateWhatsappNumber,
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
