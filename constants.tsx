
import { Product } from './types';

export const CATEGORIES = [
  'Shoes',
  'Bag',
  'Jewelry',
  'Beauty And Personal Care',
  'Men\'s Clothing',
  'Women\'s Clothing',
  'Baby Items',
  'Eyewear',
  'Office Supplies',
  'Winter Items',
  'Phone Accessories',
  'Sports And Fitness',
  'Entertainment Items',
  'Watches',
  'Automobile',
  'Groceries And Pets',
  'Outdoor And Travelling',
  'Electronics And Gadgets',
  'Kitchen Gadgets',
  'Tools And Home',
  'School Supplies'
];

export const DELIVERY_RATES: Record<string, number> = {
  'Dhaka': 130,
  'Bogura': 80,
  'Default': 150
};

export const BD_LOCATIONS: Record<string, string[]> = {
  "Dhaka": ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Motijheel", "Mohammadpur", "Badda", "Demra", "Tejgaon", "Ramna", "Savar", "Keraniganj", "Dhamrai", "Dohar", "Nawabganj"],
  "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  "Narayanganj": ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon"],
  "Chittagong": ["Panchlaish", "Bakalia", "Kotwali", "Double Mooring", "Halishahar", "Pahartali", "Bandar", "Chandgaon", "Patenga", "Hathazari", "Fatikchhari", "Raozan", "Rangunia", "Boalkhali", "Anwara", "Patiya", "Lohagara", "Chandanaish", "Satkania", "Banskhali", "Sandwip"],
  "Sylhet": ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Zakiganj"],
  "Rajshahi": ["Boalia", "Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
  "Khulna": ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsha"],
  "Barisal": ["Barisal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
  "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
  "Comilla": ["Comilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Titas", "Meghna"],
  "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Trishal"],
  "Brahmanbaria": ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Akhaura", "Bijoynagar"],
  "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"],
  "Feni": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi", "Fulgazi"],
  "Chandpur": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  "Bogura": ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Sherpur", "Shibganj", "Sonatola"],
  "Dinajpur": ["Dinajpur Sadar", "Birampur", "Birganj", "Birol", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
  "Jessore": ["Jessore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
  "Kushtia": ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
  "Tangail": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Gopalpur", "Ghatail", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"],
  "Jamalpur": ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
  "Pabna": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
  "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"],
  "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"],
  "Kishoreganj": ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
  "Sunamganj": ["Sunamganj Sadar", "Bishwamvapur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Dakshin Sunamganj"],
  "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakshai", "Madhabpur", "Nabiganj"],
  "Maulvibazar": ["Maulvibazar Sadar", "Barlekha", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal", "Juri"],
  "Laxmipur": ["Laxmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Pekua"],
  "Rangamati": ["Rangamati Sadar", "Bagaichhari", "Barkal", "Kawkhali", "Belaichhari", "Kaptai", "Jurachhari", "Langadu", "Naniyachar", "Rajasthali"],
  "Bandarban": ["Bandarban Sadar", "Ali Kadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
  "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
  "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali", "Dumki"],
  "Jhalokati": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
  "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"],
  "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
  "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],
  "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
  "Jhenaidah": ["Jhenaidah Sadar", "Harakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  "Narail": ["Narail Sadar", "Kalia", "Lohagara"],
  "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"],
  "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
  "Naogaon": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
  "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"],
  "Chapai Nawabganj": ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
  "Panchagarh": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
  "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
  "Nilphamari": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"],
  "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
  "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Chilmari", "Phulbari", "Rajarhat", "Rajibpur", "Roumari", "Nageshwari", "Ulipur"],
  "Gaibandha": ["Gaibandha Sadar", "Phulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
  "Faridpur": ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
  "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  "Madaripur": ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"],
  "Shariatpur": ["Shariatpur Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Zajira"],
  "Rajbari": ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Pangsha", "Kalukhali"],
  "Munshiganj": ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sirajdikhan", "Sreenagar", "Tongibari"]
};

export const MOCK_PRODUCTS: Product[] = [
  // Shoes
  { id: 's1', name: 'Anti-Slip Breathable Sports Sneakers', price: 2850, rating: 4.8, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'এটি একটি প্রিমিয়াম কোয়ালিটি স্পোর্টস জুতো। এটি দীর্ঘস্থায়ী এবং আরামদায়ক।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  { id: 's2', name: 'Classic Leather Formal Shoes', price: 3200, rating: 4.7, category: 'Shoes', image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop', description: 'অফিস বা যেকোনো ফরমাল অনুষ্ঠানের জন্য সেরা চামড়ার জুতো।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  { id: 's3', name: 'Casual Canvas Walking Shoes', price: 1500, rating: 4.5, category: 'Shoes', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', description: 'প্রতিদিনের ব্যবহারের জন্য হালকা এবং টেকসই ক্যানভাস জুতো।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  
  // Bag
  { id: 'b1', name: 'Luxury Leather Handbag Red', price: 4200, rating: 4.9, category: 'Bag', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop', description: 'বিলাসবহুল লেদার হ্যান্ডব্যাগ, যা আপনার আভিজাত্য ফুটিয়ে তুলবে।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  { id: 'b2', name: 'Waterproof Laptop Backpack', price: 2500, rating: 4.8, category: 'Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', description: 'ওয়াটারপ্রুফ ল্যাপটপ ব্যাকপ্যাক, অফিস বা ভ্রমণের জন্য আদর্শ।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  
  // Jewelry
  { id: 'j1', name: 'Elegant Pearl Necklace Set', price: 1500, rating: 4.7, category: 'Jewelry', image: 'https://images.unsplash.com/photo-1535633302723-999aa2777b50?w=400&h=400&fit=crop', description: 'চমৎকার মুক্তার নেকলেস সেট, যেকোনো অনুষ্ঠানে মানানসই।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  
  // Men's Clothing
  { id: 'm1', name: 'Men\'s Premium Bomber Jacket', price: 3450, rating: 4.5, category: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', description: 'শীতের জন্য প্রিমিয়াম কোয়ালিটি বোম্বার জ্যাকেট।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true },
  
  // Women's Clothing
  { id: 'w1', name: 'Floral Summer Maxi Dress', price: 1800, rating: 4.8, category: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', description: 'গরমে আরামদায়ক এবং স্টাইলিশ ফ্লোরাল ম্যাক্সি ড্রেস।', orderPolicy: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারি সময় ২-৩ দিন।', isAvailable: true }
];
