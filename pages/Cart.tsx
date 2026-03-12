
import React from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-20 text-center px-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700">
            <ShoppingBag size={48} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
          </div>
          <Link to="/" className="bg-[#e62e04] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all uppercase tracking-widest text-xs">
            Start Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 py-4 px-4">
        <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest px-1">My Shopping Cart</h2>
        
        <div className="flex flex-col gap-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50 dark:bg-white border border-gray-50" />
              <div className="flex-1 flex flex-col gap-0.5">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-[12px] line-clamp-1">{item.name}</h4>
                <p className="text-[#e62e04] font-black text-sm">৳{item.price.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 rounded-lg px-2 py-1 border border-gray-100 dark:border-slate-700">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 hover:text-[#e62e04] dark:text-gray-400">
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-black w-4 text-center dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 hover:text-[#e62e04] dark:text-gray-400">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-3 mt-2">
          <div className="flex justify-between items-center text-[11px] uppercase tracking-wider">
            <span className="text-gray-500 dark:text-gray-400 font-bold">Subtotal</span>
            <span className="font-black text-gray-800 dark:text-white">৳{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] uppercase tracking-wider">
            <span className="text-gray-500 dark:text-gray-400 font-bold">Delivery</span>
            <span className="font-black text-[#e62e04] text-[9px]">CALCULATED AT CHECKOUT</span>
          </div>
          <div className="h-[1px] bg-gray-50 dark:bg-slate-800 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-[0.2em]">Total</span>
            <span className="text-xl font-black text-[#e62e04]">৳{totalPrice.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="w-full bg-[#e62e04] text-white text-center py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none mt-2 active:scale-95 transition-all text-sm">
            Checkout Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
