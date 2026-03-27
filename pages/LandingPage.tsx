
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Star, Truck, ShieldCheck, Headphones, RotateCcw, ChevronDown, Share2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, FAQ, Review } from '../types';

const LandingPage: React.FC = () => {
  const { addToCart } = useCart();
  const { whatsappNumber, allProducts, landingConfig } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredProduct = useMemo(() => {
    let product: Product;
    if (landingConfig.featuredProductId) {
      const found = allProducts.find(p => p.id === landingConfig.featuredProductId);
      if (found) {
        product = { ...found };
      } else {
        product = allProducts[0] || {
          id: 'featured-school-bag',
          name: 'Premium Quality School Bag',
          price: 350,
          rating: 5,
          category: 'Bag',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
          description: 'প্রিমিয়াম কোয়ালিটির স্কুল ব্যাগ। টেকসই এবং স্টাইলিশ। এটি দীর্ঘস্থায়ী এবং আরামদায়ক।',
          orderPolicy: '১. ঢাকার ভিতরে ১-২ দিন ডেলিভারি।\n২. ঢাকার বাইরে ২-৪ দিন ডেলিভারি।\n৩. সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা।\n৪. পণ্য হাতে পেয়ে টাকা পরিশোধের সুযোগ।',
          isAvailable: true,
          sizes: ['M', 'L', 'XL']
        } as Product;
      }
    } else {
      product = allProducts[0] || {
        id: 'featured-school-bag',
        name: 'Premium Quality School Bag',
        price: 350,
        rating: 5,
        category: 'Bag',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
        description: 'প্রিমিয়াম কোয়ালিটির স্কুল ব্যাগ। টেকসই এবং স্টাইলিশ। এটি দীর্ঘস্থায়ী এবং আরামদায়ক।',
        orderPolicy: '১. ঢাকার ভিতরে ১-২ দিন ডেলিভারি।\n২. ঢাকার বাইরে ২-৪ দিন ডেলিভারি।\n৩. সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা।\n৪. পণ্য হাতে পেয়ে টাকা পরিশোধের সুযোগ।',
        isAvailable: true,
        sizes: ['M', 'L', 'XL']
      } as Product;
    }

    // Apply overrides from landingConfig
    if (landingConfig.description) {
      product.description = landingConfig.description;
    }
    if (landingConfig.orderPolicy) {
      product.orderPolicy = landingConfig.orderPolicy;
    }

    return product;
  }, [landingConfig.featuredProductId, landingConfig.description, landingConfig.orderPolicy, allProducts]);

  const faqs = useMemo(() => {
    if (landingConfig.faqs && landingConfig.faqs.length > 0) {
      return landingConfig.faqs;
    }
    return [
      {
        q: "ব্যাগটি কি ওয়াটারপ্রুফ?",
        a: "হ্যাঁ, এটি উচ্চমানের ওয়াটার-রেজিস্ট্যান্ট ম্যাটেরিয়াল দিয়ে তৈরি যা হালকা বৃষ্টিতে আপনার জিনিসপত্র সুরক্ষিত রাখবে।"
      },
      {
        q: "ডেলিভারি চার্জ কত?",
        a: "ঢাকার ভিতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা ডেলিভারি চার্জ প্রযোজ্য।"
      },
      {
        q: "পণ্য হাতে পেয়ে টাকা দেওয়ার সুবিধা আছে কি?",
        a: "হ্যাঁ, আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা প্রদান করি।"
      },
      {
        q: "ব্যাগটি কি টেকসই হবে?",
        a: "অবশ্যই! আমরা প্রিমিয়াম কোয়ালিটির জিপার এবং ফেব্রিক ব্যবহার করেছি যা দীর্ঘস্থায়ী ব্যবহারের নিশ্চয়তা দেয়।"
      }
    ] as FAQ[];
  }, [landingConfig.faqs]);

  const reviews = useMemo(() => {
    if (landingConfig.reviews && landingConfig.reviews.length > 0) {
      return landingConfig.reviews;
    }
    return [
      {
        name: 'আরিফ হোসেন',
        rating: 5,
        text: 'ব্যাগটি সত্যি অনেক ভালো। কালার এবং কোয়ালিটি একদম ছবির মতো।',
        image: 'https://picsum.photos/seed/user1/100/100'
      },
      {
        name: 'সুমাইয়া আক্তার',
        rating: 5,
        text: 'খুব দ্রুত ডেলিভারি পেয়েছি। সেলারের ব্যবহারও অনেক ভালো ছিল।',
        image: 'https://picsum.photos/seed/user2/100/100'
      }
    ] as Review[];
  }, [landingConfig.reviews]);

  const handleShare = async () => {
    const shareData = {
      title: featuredProduct.name,
      text: `Check out this ${featuredProduct.name} for only ৳${featuredProduct.price}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      // If the user cancels the share, we don't want to log it as an error
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      // Fallback to clipboard if sharing fails for other reasons
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (copyErr) {
        console.error('Error sharing:', err);
      }
    }
  };

  const oldPrice = 438;

  const handleBuyNow = () => {
    if (featuredProduct.sizes && featuredProduct.sizes.length > 0 && !selectedSize) {
      alert(t('select_size') || 'Please select a size');
      return;
    }
    navigate('/checkout', { state: { buyNowProduct: { ...featuredProduct, selectedSize } } });
  };

  const handleWhatsAppOrder = () => {
    const text = `Order: ${featuredProduct.name}\nPrice: ${featuredProduct.price}\nSize: ${selectedSize || 'Not selected'}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`);
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
              <img 
                src={featuredProduct.image} 
                alt={featuredProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#e62e04] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                HOT DEAL
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white leading-tight mb-2">
                  {featuredProduct.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">(48 Reviews)</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-[#e62e04]">৳{featuredProduct.price}</span>
                  <span className="text-lg text-gray-400 line-through font-bold">৳{oldPrice}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Size</h4>
                <div className="flex gap-3">
                  {featuredProduct.sizes?.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all border-2 ${
                        selectedSize === size
                          ? 'border-[#e62e04] bg-[#e62e04] text-white shadow-lg shadow-red-100'
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Selected: <span className="text-[#e62e04]">{selectedSize || 'None'}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-[#e62e04] text-white py-4 rounded-2xl flex flex-col justify-center items-center gap-0.5 font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={18} fill="currentColor" />
                    Buy Now
                  </div>
                  <span className="text-[8px] opacity-80 font-bold tracking-normal">{t('cash')}</span>
                </button>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 dark:shadow-none active:scale-95 transition-all"
                >
                  <MessageCircle size={18} fill="currentColor" />
                  Order via WhatsApp
                </button>
              </div>

              {/* Details Tabs */}
              <div className="flex flex-col gap-6 mt-4">
                <section className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 shadow-sm">
                  <h3 className="text-sm font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-3 border-l-4 border-[#e62e04] pl-3">Description</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                    {featuredProduct.description}
                  </p>
                </section>

                <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 shadow-sm">
                  <h3 className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-3 border-l-4 border-[#e62e04] pl-3">Order Policy</h3>
                  <div className="flex flex-col gap-2">
                    {(featuredProduct.orderPolicy || '').split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed font-bold">
                        {line}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-[2rem] border border-purple-100 dark:border-purple-900/30 shadow-sm">
                  <h3 className="text-sm font-black text-purple-800 dark:text-purple-300 uppercase tracking-widest mb-6 border-l-4 border-[#e62e04] pl-3">Customer Reviews</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="bg-white/60 dark:bg-slate-900/50 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30 flex gap-4">
                        {review.image && (
                          <img 
                            src={review.image} 
                            alt={review.name} 
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                          </div>
                          <h4 className="text-[10px] font-black text-purple-800 dark:text-purple-300">{review.name}</h4>
                          <p className="text-[11px] text-purple-700 dark:text-purple-400 leading-relaxed italic">"{review.text}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Share Button */}
                <div className="mt-6 bg-indigo-50 dark:bg-indigo-950/20 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                  <h3 className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-[0.2em] mb-4 text-center">Share with Friends</h3>
                  <button 
                    onClick={handleShare}
                    className="w-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl flex justify-center items-center gap-3 font-black text-xs uppercase tracking-[0.2em] border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all shadow-sm"
                  >
                    <Share2 size={18} />
                    Share this Page
                  </button>
                </div>

                {/* Contact Info */}
                <section className="mt-10 bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                  <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-6 border-l-4 border-emerald-500 pl-3">Contact Us</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-900/50 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">WhatsApp</h5>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">{whatsappNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-900/50 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <Headphones size={20} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Support Email</h5>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">support@myshopbd.com</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Trust Features */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 text-[#e62e04] rounded-full flex items-center justify-center mb-3">
                      <Truck size={20} />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white mb-1">Fast Delivery</h5>
                    <p className="text-[9px] text-gray-500 font-bold">সারা বাংলাদেশে হোম ডেলিভারি</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-full flex items-center justify-center mb-3">
                      <ShieldCheck size={20} />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white mb-1">Secure Payment</h5>
                    <p className="text-[9px] text-gray-500 font-bold">ক্যাশ অন ডেলিভারি সুবিধা</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <Headphones size={20} />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white mb-1">24/7 Support</h5>
                    <p className="text-[9px] text-gray-500 font-bold">যেকোনো প্রয়োজনে কল করুন</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full flex items-center justify-center mb-3">
                      <RotateCcw size={20} />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white mb-1">Easy Return</h5>
                    <p className="text-[9px] text-gray-500 font-bold">৭ দিনের মধ্যে রিটার্ন সুবিধা</p>
                  </div>
                </div>

                {/* FAQ Section */}
                <section className="mt-10 bg-rose-50 dark:bg-rose-950/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 shadow-sm">
                  <h3 className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest mb-6 border-l-4 border-rose-500 pl-3">Common Questions</h3>
                  <div className="flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-rose-100 dark:border-rose-900/30 rounded-2xl overflow-hidden bg-white/60 dark:bg-slate-900/50">
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full flex justify-between items-center p-4 text-left hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <div className="flex gap-3 items-center">
                            <span className="w-6 h-6 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">{faq.q}</span>
                          </div>
                          <ChevronDown size={16} className={`text-rose-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === index && (
                          <div className="p-4 bg-rose-50/30 dark:bg-rose-950/30 border-t border-rose-100 dark:border-rose-900/30">
                            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed pl-9">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Final CTA */}
                <div className="mt-12 mb-8 p-8 bg-[#e62e04] rounded-[2.5rem] text-center shadow-2xl shadow-red-200 dark:shadow-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
                  
                  <h2 className="text-2xl font-black text-white mb-2 relative z-10">অর্ডার করতে দেরি করবেন না!</h2>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6 relative z-10">স্টক সীমিত, এখনই আপনারটি সংগ্রহ করুন</p>
                  
                  <button 
                    onClick={handleBuyNow}
                    className="w-full bg-white text-[#e62e04] py-4 rounded-2xl flex flex-col justify-center items-center gap-0.5 font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all relative z-10"
                  >
                    <div className="flex items-center gap-2">
                      <Zap size={20} fill="currentColor" />
                      অর্ডার করুন এখনই
                    </div>
                    <span className="text-[10px] opacity-80 font-bold tracking-normal">{t('cash')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
