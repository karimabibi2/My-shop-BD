
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  description: string;
  orderPolicy?: string;
  isAvailable: boolean;
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  role?: 'admin' | 'client';
}

export interface Address {
  id: string;
  label: string; // e.g., Home, Office
  fullName: string;
  phone: string;
  details: string;
  district: string;
  thana: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  date: string;
  address: string;
  customerName?: string;
  phone?: string;
  paymentMethod?: 'COD' | 'bKash' | 'Nagad';
  uid?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Review {
  name: string;
  text: string;
  rating: number;
  image?: string;
}

export interface LandingConfig {
  featuredProductId: string;
  description?: string;
  orderPolicy?: string;
  faqs: FAQ[];
  reviews: Review[];
}

export type CategoryType = string;
