
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { db, doc, getDoc, setDoc, onSnapshot } from '../firebase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthReady } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const isInitialLoad = useRef(true);
  const skipSync = useRef(false);

  // Load cart based on user status
  useEffect(() => {
    if (!isAuthReady) return;

    let unsubscribe: (() => void) | undefined;

    const loadCart = async () => {
      if (user) {
        // Logged in: Sync with Firestore
        const cartRef = doc(db, 'carts', user.id);
        
        // Initial fetch
        try {
          const cartDoc = await getDoc(cartRef);
          if (cartDoc.exists()) {
            const data = cartDoc.data();
            setCart(data.items || []);
          } else {
            // Check if there's a local cart to migrate
            const localCart = localStorage.getItem('shopbd_cart_guest');
            if (localCart) {
              const items = JSON.parse(localCart);
              setCart(items);
              await setDoc(cartRef, { items, updatedAt: new Date().toISOString() });
              localStorage.removeItem('shopbd_cart_guest');
            } else {
              setCart([]);
            }
          }
        } catch (e) {
          console.error("Error loading Firestore cart:", e);
        }

        // Listen for remote changes (e.g. from another tab/device)
        unsubscribe = onSnapshot(cartRef, (snapshot) => {
          if (snapshot.exists() && !skipSync.current) {
            const data = snapshot.data();
            setCart(data.items || []);
          }
        });
      } else {
        // Guest: Use localStorage
        const savedCart = localStorage.getItem('shopbd_cart_guest');
        setCart(savedCart ? JSON.parse(savedCart) : []);
      }
      isInitialLoad.current = false;
    };

    loadCart();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, isAuthReady]);

  // Save cart changes
  useEffect(() => {
    if (isInitialLoad.current || !isAuthReady) return;

    const saveCart = async () => {
      if (user) {
        // Save to Firestore
        skipSync.current = true;
        try {
          await setDoc(doc(db, 'carts', user.id), {
            items: cart,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          console.error("Error saving Firestore cart:", e);
        } finally {
          setTimeout(() => { skipSync.current = false; }, 1000);
        }
      } else {
        // Save to guest localStorage
        localStorage.setItem('shopbd_cart_guest', JSON.stringify(cart));
      }
    };

    saveCart();
  }, [cart, user, isAuthReady]);

  const addToCart = useCallback((product: Product, selectedSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedSize === selectedSize) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
