
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order, Address, Product } from '../types';
import { MOCK_PRODUCTS, DELIVERY_RATES } from '../constants';

interface AuthContextType {
  user: User | null;
  orders: Order[];
  allProducts: Product[];
  addresses: Address[];
  shippingRates: Record<string, number>;
  login: (email: string) => void;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  updateShippingRates: (rates: Record<string, number>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shopbd_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('shopbd_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('shopbd_products');
    return savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS;
  });
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const savedAddresses = localStorage.getItem('shopbd_addresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });
  const [shippingRates, setShippingRates] = useState<Record<string, number>>(() => {
    const savedRates = localStorage.getItem('shopbd_rates');
    return savedRates ? JSON.parse(savedRates) : DELIVERY_RATES;
  });

  useEffect(() => {
    localStorage.setItem('shopbd_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shopbd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopbd_products', JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem('shopbd_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('shopbd_rates', JSON.stringify(shippingRates));
  }, [shippingRates]);

  const login = (email: string) => {
    const isAdmin = email.toLowerCase() === 'admin@shopbd.com';
    const newUser = {
      id: isAdmin ? 'admin' : Math.random().toString(36).substr(2, 9),
      name: isAdmin ? 'Admin User' : email.split('@')[0],
      email: email,
      avatar: `https://picsum.photos/seed/${email}/100/100`,
      isAdmin: isAdmin
    };
    setUser(newUser);
    
    if (!isAdmin && addresses.length === 0) {
      setAddresses([{
        id: 'default',
        label: 'Home',
        fullName: email.split('@')[0],
        phone: '01700000000',
        details: 'House #12, Road #5, Block-A',
        district: 'Dhaka',
        thana: 'Gulshan'
      }]);
    }
  };

  const adminLogin = (username: string, password: string): boolean => {
    // Hardcoded admin credentials as requested
    if (username === 'Niloyshop' && password === 'Niloyshop12#') {
      setUser({
        id: 'admin',
        name: 'Niloy Shop Admin',
        email: 'admin@niloyshop.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niloyshop',
        isAdmin: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Don't clear orders or products on logout, as they should persist for the admin
    // Only clear addresses if it's a non-admin user logging out? 
    // Actually, let's keep them for simplicity in this demo.
  };

  const addOrder = (order: Order) => {
    const orderWithCustomer = { ...order, customerName: user?.name || 'Guest' };
    setOrders(prev => [orderWithCustomer, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateProduct = (product: Product) => {
    setAllProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (productId: string) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addProduct = (product: Product) => {
    setAllProducts(prev => [product, ...prev]);
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

  return (
    <AuthContext.Provider value={{ 
      user, orders, allProducts, addresses, shippingRates, login, adminLogin, logout, 
      addOrder, updateOrderStatus, updateProduct, deleteProduct, addProduct,
      addAddress, removeAddress, updateShippingRates 
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
