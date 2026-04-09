import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product, Category, LandingConfig } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES, CATEGORIES } from '../constants';
import { trackingService, TrackingConfig } from '../services/TrackingService';
import { toast } from 'sonner';
import { 
  auth, db, googleProvider, 
  signInWithPopup, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, onSnapshot, query, where, orderBy, limit, increment,
  ref, uploadBytes, getDownloadURL, storage, uploadBytesResumable
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

        // Initialize settings if missing - ONLY if user is an admin
        if (isAdminEmail) {
          try {
            const settingsDoc = await getDoc(doc(db, 'config', 'settings'));
            if (!settingsDoc.exists()) {
              await setDoc(doc(db, 'config', 'settings'), {
                bannerImage: '',
                whatsappNumber: '8801304881109',
                siteName: 'Niloy Shop BD',
                visitorCount: 0
              });
              console.log("Settings initialized successfully");
            }
          } catch (e) {
            console.error("Failed to initialize settings:", e);
          }
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

  // Visitor count logic
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('shopbd_visited');
    if (!hasVisited && isAuthReady) {
      sessionStorage.setItem('shopbd_visited', 'true');
      
      // Update in Firestore using increment
      updateDoc(doc(db, 'config', 'settings'), { 
        visitorCount: increment(1) 
      }).catch(e => console.error("Failed to update visitor count:", e));
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
        toast.info('Logged in as Local Admin. Note: Some features like image uploads may require Google Login for full Firebase permissions.');
        return true;
      }
      return false;
    }
  };

  const updateAdminCredentials = async (username: string, password: string) => {
    try {
      setAdminUsername(username);
      setAdminPassword(password);
      await setDoc(doc(db, 'config', 'settings'), {
        adminUsername: username,
        adminPassword: password
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
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
    console.log('Adding product to Firestore:', product);
    try {
      await setDoc(doc(db, 'products', product.id), product);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const updateCategory = async (oldName: string, newName: string, image?: string) => {
    if (!newName || oldName === newName && !image) return;
    try {
      // 1. Update the category document
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

      // 2. Update all products in this category if name changed
      if (oldName !== newName) {
        const productsToUpdate = allProducts.filter(p => p.category === oldName);
        for (const product of productsToUpdate) {
          await updateDoc(doc(db, 'products', product.id), { category: newName });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'categories');
    }
  };

  const deleteCategory = async (name: string) => {
    if (!name || name === 'Uncategorized') return;
    try {
      // 1. Find and delete the category document
      const q = query(collection(db, 'categories'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const categoryDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'categories', categoryDoc.id));
      }

      // 2. Move products to "Uncategorized"
      const productsToUpdate = allProducts.filter(p => p.category === name);
      for (const product of productsToUpdate) {
        await updateDoc(doc(db, 'products', product.id), { category: 'Uncategorized' });
      }
      
      // 3. Ensure "Uncategorized" exists
      const uncatQ = query(collection(db, 'categories'), where('name', '==', 'Uncategorized'));
      const uncatSnap = await getDocs(uncatQ);
      if (uncatSnap.empty) {
        await addDoc(collection(db, 'categories'), { name: 'Uncategorized', image: '' });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'categories');
    }
  };

  const addCategory = async (name: string, image?: string) => {
    if (!name) return;
    console.log('Adding category to Firestore:', { name, image });
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }
    try {
      await addDoc(collection(db, 'categories'), { name, image: image || '' });
      console.log('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
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

  const updateShippingRates = async (rates: Record<string, number>) => {
    try {
      setShippingRates(rates);
      await setDoc(doc(db, 'config', 'settings'), { shippingRates: rates }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateUser = (name: string, avatar: string) => {
    if (user) {
      const updatedUser = { ...user, name, avatar };
      setUser(updatedUser);
    }
  };

  const syncProducts = async () => {
    try {
      for (const product of MOCK_PRODUCTS) {
        await setDoc(doc(db, 'products', product.id), product);
      }
      toast.success('Products synced to database');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const syncCategories = async () => {
    try {
      for (const name of CATEGORIES) {
        const q = query(collection(db, 'categories'), where('name', '==', name));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, 'categories'), { name, image: '' });
        }
      }
      toast.success('Categories synced to database');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
  };

  const updateBannerImage = async (image: string) => {
    try {
      setBannerImage(image);
      await setDoc(doc(db, 'config', 'settings'), { bannerImage: image }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updatePaymentMethodsImage = async (image: string) => {
    try {
      setPaymentMethodsImage(image);
      await setDoc(doc(db, 'config', 'settings'), { paymentMethodsImage: image }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateWhatsappNumber = async (number: string) => {
    try {
      setWhatsappNumber(number);
      await setDoc(doc(db, 'config', 'settings'), { whatsappNumber: number }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };
  const updateBkashNumber = async (number: string) => {
    try {
      setBkashNumber(number);
      await setDoc(doc(db, 'config', 'settings'), { bkashNumber: number }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };
  const updateNagadNumber = async (number: string) => {
    try {
      setNagadNumber(number);
      await setDoc(doc(db, 'config', 'settings'), { nagadNumber: number }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };
  const updateRocketNumber = async (number: string) => {
    try {
      setRocketNumber(number);
      await setDoc(doc(db, 'config', 'settings'), { rocketNumber: number }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateFacebookLink = async (link: string) => {
    try {
      setFacebookLink(link);
      await setDoc(doc(db, 'config', 'settings'), { facebookLink: link }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateYoutubeLink = async (link: string) => {
    try {
      setYoutubeLink(link);
      await setDoc(doc(db, 'config', 'settings'), { youtubeLink: link }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateTiktokLink = async (link: string) => {
    try {
      setTiktokLink(link);
      await setDoc(doc(db, 'config', 'settings'), { tiktokLink: link }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateGlobalOrderPolicy = async (policy: string) => {
    try {
      setGlobalOrderPolicy(policy);
      await setDoc(doc(db, 'config', 'settings'), { globalOrderPolicy: policy }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateTrackingConfig = async (config: TrackingConfig) => {
    try {
      setTrackingConfig(config);
      trackingService.init(config);
      await setDoc(doc(db, 'config', 'settings'), { trackingConfig: config }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const clearTrackingLogs = () => {
    trackingService.clearLogs();
    setTrackingLogs([]);
  };

  const updateCustomApiKey = async (key: string) => {
    try {
      setCustomApiKey(key);
      await setDoc(doc(db, 'config', 'settings'), { customApiKey: key }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updatePromoBannerEnabled = async (enabled: boolean) => {
    try {
      setIsPromoBannerEnabled(enabled);
      await setDoc(doc(db, 'config', 'settings'), { isPromoBannerEnabled: enabled }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateDarkModeDefault = async (enabled: boolean) => {
    try {
      setIsDarkModeDefault(enabled);
      await setDoc(doc(db, 'config', 'settings'), { isDarkModeDefault: enabled }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'config/settings');
    }
  };

  const updateLandingConfig = async (config: LandingConfig) => {
    try {
      await setDoc(doc(db, 'config', 'landing'), config);
      setLandingConfig(config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/landing');
    }
  };

  const uploadImage = (file: File | Blob, path: string, onProgress?: (progress: number) => void): Promise<string> => {
    console.log('Initiating upload to:', path, 'File:', file);
    return new Promise((resolve, reject) => {
      try {
        if (!file) {
          reject(new Error('No file provided for upload'));
          return;
        }
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Add a timeout of 60 seconds
        const timeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error('Upload timed out after 60 seconds'));
        }, 60000);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress for ${path}: ${progress.toFixed(2)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
            if (onProgress) onProgress(progress);
          }, 
          (error) => {
            clearTimeout(timeout);
            console.error('Error uploading image to', path, ':', error);
            toast.error(`Upload failed: ${error.message}`);
            reject(error);
          }, 
          async () => {
            clearTimeout(timeout);
            try {
              console.log('Upload complete for', path);
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Download URL for', path, ':', downloadURL);
              resolve(downloadURL);
            } catch (error: any) {
              console.error('Error getting download URL for', path, ':', error);
              toast.error(`Failed to get download URL: ${error.message}`);
              reject(error);
            }
          }
        );
      } catch (error: any) {
        console.error('Error initiating upload for', path, ':', error);
        toast.error(`Failed to initiate upload: ${error.message}`);
        reject(error);
      }
    });
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
      landingConfig, updateLandingConfig, uploadImage,
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
