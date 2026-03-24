
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
  { id: 's1', name: 'Anti-Slip Breathable Sports Sneakers', price: 2850, rating: 4.8, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'Professional running shoes with cloud-comfort technology.', isAvailable: true },
  { id: 's2', name: 'Classic Leather Formal Shoes', price: 3200, rating: 4.7, category: 'Shoes', image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop', description: 'Elegant leather shoes for formal occasions.', isAvailable: true },
  { id: 's3', name: 'Casual Canvas Walking Shoes', price: 1500, rating: 4.5, category: 'Shoes', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', description: 'Comfortable canvas shoes for daily wear.', isAvailable: true },
  
  // Bag
  { id: 'b1', name: 'Luxury Leather Handbag Red', price: 4200, rating: 4.9, category: 'Bag', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop', description: 'Premium quality designer bag for special occasions.', isAvailable: true },
  { id: 'b2', name: 'Waterproof Laptop Backpack', price: 2500, rating: 4.8, category: 'Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', description: 'Spacious and durable backpack for work or travel.', isAvailable: true },
  { id: 'b3', name: 'Stylish Crossbody Sling Bag', price: 1200, rating: 4.6, category: 'Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', description: 'Compact and trendy bag for essentials.', isAvailable: true },

  // Jewelry
  { id: 'j1', name: 'Elegant Pearl Necklace Set', price: 1500, rating: 4.7, category: 'Jewelry', image: 'https://images.unsplash.com/photo-1535633302723-999aa2777b50?w=400&h=400&fit=crop', description: 'Timeless piece for elegant evenings.', isAvailable: true },
  { id: 'j2', name: 'Traditional Gold Plated Jhumka', price: 1250, rating: 4.9, category: 'Jewelry', image: 'https://images.unsplash.com/photo-1630019051930-47382dbdb58c?w=400&h=400&fit=crop', description: 'Beautiful traditional earrings for festive occasions.', isAvailable: true },
  { id: 'j3', name: 'Minimalist Silver Bracelet', price: 850, rating: 4.8, category: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', description: 'Simple and chic silver bracelet for daily wear.', isAvailable: true },

  // Beauty
  { id: 'be1', name: 'Ultra-Hydrating Skin Care Set', price: 3200, rating: 4.6, category: 'Beauty And Personal Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', description: 'Complete kit for glowing skin.', isAvailable: true },
  { id: 'be2', name: 'Matte Finish Liquid Lipstick', price: 450, rating: 4.5, category: 'Beauty And Personal Care', image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&h=400&fit=crop', description: 'Long-lasting matte lipstick in various shades.', isAvailable: true },
  { id: 'be3', name: 'Organic Aloe Vera Gel', price: 350, rating: 4.7, category: 'Beauty And Personal Care', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop', description: 'Pure and natural soothing gel for skin and hair.', isAvailable: true },

  // Clothing
  { id: 'm1', name: 'Men\'s Premium Bomber Jacket', price: 3450, rating: 4.5, category: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', description: 'Stylish and warm for the modern man.', isAvailable: true },
  { id: 'm2', name: 'Slim Fit Cotton Polo Shirt', price: 1200, rating: 4.6, category: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop', description: 'Classic polo shirt for a smart casual look.', isAvailable: true },
  { id: 'w1', name: 'Floral Summer Maxi Dress', price: 1800, rating: 4.8, category: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', description: 'Lightweight and stylish for warm days.', isAvailable: true },
  { id: 'w2', name: 'High-Waist Denim Jeans', price: 2200, rating: 4.7, category: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop', description: 'Comfortable and trendy denim for everyday wear.', isAvailable: true },

  // Baby
  { id: 'ba1', name: 'Soft Cotton Baby Romper Set', price: 950, rating: 4.9, category: 'Baby Items', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', description: '100% organic cotton for sensitive skin.', isAvailable: true },
  { id: 'ba2', name: 'Baby Teething Toy Set', price: 450, rating: 4.8, category: 'Baby Items', image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop', description: 'Safe and BPA-free toys for teething babies.', isAvailable: true },

  // Eyewear
  { id: 'e1', name: 'Classic Aviator UV400 Sunglasses', price: 1200, rating: 4.7, category: 'Eyewear', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', description: 'Protect your eyes in style.', isAvailable: true },
  { id: 'e2', name: 'Blue Light Blocking Glasses', price: 850, rating: 4.6, category: 'Eyewear', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop', description: 'Reduce eye strain during screen time.', isAvailable: true },

  // Office
  { id: 'o1', name: 'High Precision Silent Wireless Mouse', price: 850, rating: 4.6, category: 'Office Supplies', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', description: 'Noiseless clicking for productive work.', isAvailable: true },
  { id: 'o2', name: 'Ergonomic Memory Foam Seat Cushion', price: 1800, rating: 4.8, category: 'Office Supplies', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', description: 'Support your back during long working hours.', isAvailable: true },

  // Winter
  { id: 'wi1', name: 'Woolen Thick Knit Winter Scarf', price: 650, rating: 4.8, category: 'Winter Items', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop', description: 'Stay warm and cozy all season.', isAvailable: true },
  { id: 'wi2', name: 'Thermal Insulated Winter Gloves', price: 450, rating: 4.7, category: 'Winter Items', image: 'https://images.unsplash.com/photo-1543330091-27228394c7dc?w=400&h=400&fit=crop', description: 'Touchscreen compatible warm gloves.', isAvailable: true },

  // Phone
  { id: 'p1', name: 'Shockproof Case for iPhone 15', price: 450, rating: 4.5, category: 'Phone Accessories', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', description: 'Military grade protection for your phone.', isAvailable: true },
  { id: 'p2', name: 'Fast Charging USB-C Cable 2M', price: 350, rating: 4.6, category: 'Phone Accessories', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop', description: 'Durable and high-speed charging cable.', isAvailable: true },

  // Sports
  { id: 'sp1', name: 'Durable Adjustable Jump Rope', price: 350, rating: 4.4, category: 'Sports And Fitness', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=400&fit=crop', description: 'Perfect for cardio workouts at home.', isAvailable: true },
  { id: 'sp2', name: 'Non-Slip TPE Yoga Mat', price: 1500, rating: 4.8, category: 'Sports And Fitness', image: 'https://images.unsplash.com/photo-1592432676556-38027d0226c7?w=400&h=400&fit=crop', description: 'Extra thick cushioning for yoga and pilates.', isAvailable: true },

  // Electronics
  { id: 'el1', name: 'Noise Cancelling Wireless Earbuds', price: 5500, rating: 4.8, category: 'Electronics And Gadgets', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', description: 'Crystal clear sound and deep bass.', isAvailable: true },
  { id: 'el2', name: 'Portable Bluetooth Speaker', price: 2800, rating: 4.7, category: 'Electronics And Gadgets', image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&h=400&fit=crop', description: 'Water-resistant speaker with 12h playtime.', isAvailable: true },

  // Kitchen
  { id: 'k1', name: 'Portable Electric Air Fryer 4L', price: 8500, rating: 4.9, category: 'Kitchen Gadgets', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop', description: 'Cook healthy meals with 90% less oil.', isAvailable: true },
  { id: 'k2', name: 'Multi-Function Vegetable Chopper', price: 1200, rating: 4.6, category: 'Kitchen Gadgets', image: 'https://images.unsplash.com/photo-1585837554808-a19e1373298e?w=400&h=400&fit=crop', description: 'Save time in the kitchen with easy chopping.', isAvailable: true },

  // Watches
  { id: 'wa1', name: 'Smart Fitness Tracker Watch', price: 2900, rating: 4.7, category: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', description: 'Track your steps, heart rate, and sleep.', isAvailable: true },
  { id: 'wa2', name: 'Classic Analog Men\'s Watch', price: 4500, rating: 4.8, category: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', description: 'Timeless design with stainless steel strap.', isAvailable: true },

  // School
  { id: 'sc1', name: 'Professional Art Sketching Set', price: 1200, rating: 4.8, category: 'School Supplies', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', description: 'Premium pencils for students and artists.', isAvailable: true },
  { id: 'sc2', name: 'Large Capacity Pencil Case', price: 350, rating: 4.7, category: 'School Supplies', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop', description: 'Organize all your stationery in one place.', isAvailable: true },

  // Automobile
  { id: 'au1', name: 'Car Dashboard Phone Mount', price: 750, rating: 4.6, category: 'Automobile', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop', description: 'Secure and stable phone mounting.', isAvailable: true },
  { id: 'au2', name: 'Portable Car Vacuum Cleaner', price: 2200, rating: 4.5, category: 'Automobile', image: 'https://images.unsplash.com/photo-1563911191470-3974e4468578?w=400&h=400&fit=crop', description: 'Keep your car interior spotless.', isAvailable: true },

  // Groceries
  { id: 'gr1', name: 'Organic Premium Cashew Nuts 500g', price: 850, rating: 4.9, category: 'Groceries And Pets', image: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=400&h=400&fit=crop', description: 'Fresh and crunchy high-quality cashews.', isAvailable: true },
  { id: 'gr2', name: 'Premium Roasted Coffee Beans', price: 1200, rating: 4.8, category: 'Groceries And Pets', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', description: 'Rich and aromatic coffee for your mornings.', isAvailable: true },

  // Travelling
  { id: 'tr1', name: 'Hard Shell 24" Travel Suitcase', price: 4500, rating: 4.8, category: 'Outdoor And Travelling', image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop', description: 'Hard Shell travel suitcase.', isAvailable: true },
  { id: 'tr2', name: 'Compact Travel Neck Pillow', price: 650, rating: 4.7, category: 'Outdoor And Travelling', image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?w=400&h=400&fit=crop', description: 'Soft and supportive pillow for long journeys.', isAvailable: true },

  // Entertainment
  { id: 'en1', name: 'Handheld Retro Game Console', price: 1800, rating: 4.5, category: 'Entertainment Items', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop', description: 'Built-in 500 classic games for hours of fun.', isAvailable: true },
  { id: 'en2', name: 'Wireless Karaoke Microphone', price: 1500, rating: 4.6, category: 'Entertainment Items', image: 'https://images.unsplash.com/photo-1583127817773-521518e26a88?w=400&h=400&fit=crop', description: 'Sing your heart out with built-in speaker.', isAvailable: true },

  // Tools
  { id: 'to1', name: 'Multipurpose Home Tool Kit Set', price: 3200, rating: 4.7, category: 'Tools And Home', image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=400&h=400&fit=crop', description: 'Essential tools for any home repair.', isAvailable: true },
  { id: 'to2', name: 'Rechargeable Cordless Drill', price: 5500, rating: 4.8, category: 'Tools And Home', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop', description: 'Powerful and portable drill for DIY projects.', isAvailable: true }
];
