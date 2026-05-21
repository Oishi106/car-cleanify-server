const ShopProduct = require('./models/ShopProduct');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const { Category, Cart } = require('./models/Category');

connectDB();

// ── Service Category Data ─────────────────────────────────
const categoryData = {
  name: 'Car Cleaning',
  slug: 'car-cleaning',
  description: 'Professional car cleaning and detailing services',
  isActive: true,
};

// ── Services ──────────────────────────────────────────────
const services = [
  {
    name: 'Basic Exterior Wash',
    description: 'Quick exterior cleaning with foam wash and drying.',
    price: 499,
    duration: '30 mins',
    rating: 4.5,
    popular: false,
    image: 'https://i.ibb.co.com/nNmzVM8G/Basic-Exterior-Wash.avif',
    features: ['Foam Wash', 'Tire Cleaning', 'Glass Wipe', 'Hand Dry'],
  },
  {
    name: 'Interior Vacuum Cleaning',
    description: 'Deep interior vacuum and dust removal service.',
    price: 699,
    duration: '45 mins',
    rating: 4.7,
    popular: true,
    image: 'https://i.ibb.co.com/whF393b2/Interior-Vacuum-Cleaning.avif',
    features: ['Seat Vacuum', 'Floor Cleaning', 'Dashboard Dusting', 'Door Panel Cleaning'],
  },
  {
    name: 'Premium Full Wash',
    description: 'Complete interior and exterior premium cleaning.',
    price: 1499,
    duration: '90 mins',
    rating: 4.9,
    popular: true,
    image: 'https://i.ibb.co.com/1JhKq2Cz/Premium-Full-Wash.avif',
    features: ['Exterior Wash', 'Interior Vacuum', 'Tire Polish', 'Dashboard Polish'],
  },
  {
    name: 'Engine Bay Cleaning',
    description: 'Safe engine bay degreasing and cleaning.',
    price: 899,
    duration: '40 mins',
    rating: 4.4,
    popular: false,
    image: 'https://i.ibb.co.com/ccz4Y4hT/Engine-Bay-Cleaning.avif',
    features: ['Degreasing', 'Dust Removal', 'Plastic Shine', 'Safe Drying'],
  },
  {
    name: 'Ceramic Coating',
    description: 'Long-lasting ceramic paint protection coating.',
    price: 7999,
    duration: '5 hours',
    rating: 5.0,
    popular: true,
    image: 'https://i.ibb.co.com/4R19YDxC/Ceramic-Coating.avif',
    features: ['Paint Protection', 'Gloss Finish', 'Water Repellent', 'Scratch Resistance'],
  },
  {
    name: 'Wax Polish Service',
    description: 'Professional waxing for extra shine.',
    price: 1299,
    duration: '60 mins',
    rating: 4.6,
    popular: false,
    image: 'https://i.ibb.co.com/9mkNRBnZ/Wax-Polish-Service.avif',
    features: ['Hand Wax', 'Paint Shine', 'Dust Protection', 'Smooth Finish'],
  },
  {
    name: 'Seat Shampoo Cleaning',
    description: 'Fabric seat deep shampoo wash service.',
    price: 1199,
    duration: '75 mins',
    rating: 4.8,
    popular: false,
    image: 'https://i.ibb.co.com/whF393b2/Interior-Vacuum-Cleaning.avif',
    features: ['Foam Shampoo', 'Stain Removal', 'Odor Removal', 'Dry Finish'],
  },
  {
    name: 'Leather Seat Care',
    description: 'Premium leather seat conditioning and cleaning.',
    price: 1599,
    duration: '70 mins',
    rating: 4.9,
    popular: true,
    image: 'https://i.ibb.co.com/67jcZMxW/Leather-Seat-Care.avif',
    features: ['Leather Cleaning', 'Conditioning', 'Crack Protection', 'Soft Finish'],
  },
  {
    name: 'Headlight Restoration',
    description: 'Restore faded headlights for better visibility.',
    price: 999,
    duration: '35 mins',
    rating: 4.5,
    popular: false,
    image: 'https://i.ibb.co.com/n8sYYscF/Headlight-Restoration.avif',
    features: ['Oxidation Removal', 'Polishing', 'Clear Coating', 'Brightness Restore'],
  },
  {
    name: 'Undercarriage Wash',
    description: 'Remove mud and dirt from undercarriage.',
    price: 799,
    duration: '30 mins',
    rating: 4.3,
    popular: false,
    image: 'https://i.ibb.co.com/d0n6Qd3B/Undercarriage-Wash.avif',
    features: ['Mud Removal', 'Pressure Wash', 'Rust Prevention', 'Quick Dry'],
  },
  {
    name: 'Express Car Wash',
    description: 'Fast and affordable exterior cleaning.',
    price: 399,
    duration: '20 mins',
    rating: 4.2,
    popular: true,
    image: 'https://i.ibb.co.com/gbmgVyb0/Express-Car-Wash.avif',
    features: ['Quick Foam Wash', 'Tire Rinse', 'Dry Finish', 'Window Cleaning'],
  },
  {
    name: 'SUV Deep Cleaning',
    description: 'Complete cleaning package for SUVs.',
    price: 2499,
    duration: '2 hours',
    rating: 4.9,
    popular: true,
    image: 'https://i.ibb.co.com/201ZTcQ2/SUV-Deep-Cleaning.avif',
    features: ['Interior Cleaning', 'Exterior Wash', 'Wax Finish', 'Vacuum Service'],
  },
  {
    name: 'Truck Wash Service',
    description: 'Heavy-duty truck exterior and wheel cleaning.',
    price: 2999,
    duration: '2.5 hours',
    rating: 4.6,
    popular: false,
    image: 'https://i.ibb.co.com/JW2pZKYw/Truck-Wash-Service.avif',
    features: ['Heavy Foam Wash', 'Wheel Cleaning', 'Pressure Wash', 'Dry Finish'],
  },
  {
    name: 'Motorbike Detailing',
    description: 'Detailed bike wash and polishing.',
    price: 699,
    duration: '40 mins',
    rating: 4.7,
    popular: false,
    image: 'https://i.ibb.co.com/RTymWj9P/Motorbike-Detailing.webp',
    features: ['Chain Cleaning', 'Body Wash', 'Polish Finish', 'Wheel Shine'],
  },
  {
    name: 'Interior Sanitization',
    description: 'Complete germ and odor removal service.',
    price: 999,
    duration: '50 mins',
    rating: 4.8,
    popular: true,
    image: 'https://i.ibb.co.com/gL0D2kyZ/Interior-Sanitization.avif',
    features: ['Disinfection', 'Odor Removal', 'AC Vent Cleaning', 'Seat Sanitizing'],
  },
  {
    name: 'Waterless Car Wash',
    description: 'Eco-friendly waterless car cleaning solution.',
    price: 899,
    duration: '35 mins',
    rating: 4.4,
    popular: false,
    image: 'https://i.ibb.co.com/zVktFZ1r/Waterless-Car-Wash.avif',
    features: ['Eco Friendly', 'Scratch Safe', 'Quick Shine', 'Low Water Usage'],
  },
  {
    name: 'Paint Protection Film',
    description: 'Transparent film protection for car paint.',
    price: 14999,
    duration: '8 hours',
    rating: 5.0,
    popular: true,
    image: 'https://i.ibb.co.com/nx5pPC1/Paint-Protection-Film.avif',
    features: ['Scratch Protection', 'Gloss Finish', 'UV Protection', 'Long Lasting'],
  },
  {
    name: 'Convertible Roof Cleaning',
    description: 'Special cleaning for convertible soft tops.',
    price: 1899,
    duration: '80 mins',
    rating: 4.6,
    popular: false,
    image: 'https://i.ibb.co.com/BKGSL4Pm/Convertible-Roof-Cleaning.avif',
    features: ['Fabric Wash', 'Mold Removal', 'Protective Coating', 'Soft Finish'],
  },
  {
    name: 'Luxury Car Detailing',
    description: 'Premium detailing package for luxury vehicles.',
    price: 9999,
    duration: '6 hours',
    rating: 5.0,
    popular: true,
    image: 'https://i.ibb.co.com/MDWSM90d/Luxury-Car-Detailing.avif',
    features: ['Full Detailing', 'Ceramic Wax', 'Interior Care', 'Paint Protection'],
  },
  {
    name: 'Monthly Cleaning Subscription',
    description: 'Monthly package with scheduled washes.',
    price: 4999,
    duration: 'Monthly',
    rating: 4.8,
    popular: true,
    image: 'https://i.ibb.co.com/N6HyDtnN/Monthly-Cleaning-Subscription.avif',
    features: ['4 Car Washes', 'Priority Booking', 'Interior Cleaning', 'Discount Offers'],
  },
];

// ── Shop Products ─────────────────────────────────────────
const shopProducts = [
  {
    name: 'Premium Car Shampoo',
    description: 'High foam formula for deep exterior cleaning.',
    price: 650,
    discountPrice: 0,
    rating: 4.8,
    numReviews: 120,
    stock: 50,
    badge: '20% OFF',
    image: 'https://i.ibb.co.com/cc1cdzkn/Premium-Car-Shampoo.jpg',
    tags: ['shampoo', 'cleaning', 'exterior'],
    isFeatured: true,
    categoryName: 'Cleaning Products',
  },
  {
    name: 'Microfiber Cleaning Towel',
    description: 'Ultra soft microfiber towel for scratch-free drying.',
    price: 350,
    discountPrice: 0,
    rating: 4.7,
    numReviews: 98,
    stock: 100,
    badge: 'Best Seller',
    image: 'https://i.ibb.co.com/j9d69DT3/Microfiber-Cleaning-Towel.jpg',
    tags: ['towel', 'accessories', 'microfiber'],
    isFeatured: true,
    categoryName: 'Accessories',
  },
  {
    name: 'Tire Shine Spray',
    description: 'Long-lasting tire shine with glossy finish.',
    price: 500,
    discountPrice: 0,
    rating: 4.6,
    numReviews: 87,
    stock: 30,
    badge: 'Popular',
    image: 'https://i.ibb.co.com/HpC6p3XV/Tire-Shine-Spray.jpg',
    tags: ['tire', 'shine', 'exterior'],
    isFeatured: false,
    categoryName: 'Cleaning Products',
  },
  {
    name: 'Interior Dashboard Polish',
    description: 'Protects dashboard from dust and UV damage.',
    price: 720,
    discountPrice: 0,
    rating: 4.9,
    numReviews: 150,
    stock: 45,
    badge: 'Hot',
    image: 'https://i.ibb.co.com/9m0Tt6w6/Interior-Dashboard-Polish.jpg',
    tags: ['interior', 'dashboard', 'polish'],
    isFeatured: true,
    categoryName: 'Interior Care',
  },
  {
    name: 'Portable Vacuum Cleaner',
    description: 'Compact and powerful vacuum for car interiors.',
    price: 2500,
    discountPrice: 0,
    rating: 4.8,
    numReviews: 210,
    stock: 20,
    badge: 'Trending',
    image: 'https://i.ibb.co.com/PZrj9pTL/Portable-Vacuum-Cleaner.jpg',
    tags: ['vacuum', 'gadget', 'interior'],
    isFeatured: true,
    categoryName: 'Gadgets',
  },
  {
    name: 'Foam Wash Gun',
    description: 'Creates thick foam for premium car washing.',
    price: 1800,
    discountPrice: 0,
    rating: 4.7,
    numReviews: 90,
    stock: 25,
    badge: 'New',
    image: 'https://i.ibb.co.com/SXz8Lvjx/Foam-Wash-Gun.jpg',
    tags: ['foam', 'wash', 'accessories'],
    isFeatured: false,
    categoryName: 'Accessories',
  },
  {
    name: 'Leather Seat Cleaner',
    description: 'Deep cleans and conditions leather seats.',
    price: 950,
    discountPrice: 0,
    rating: 4.9,
    numReviews: 133,
    stock: 40,
    badge: 'Top Rated',
    image: 'https://i.ibb.co.com/TMg9NS18/Leather-Seat-Cleaner.jpg',
    tags: ['leather', 'interior', 'cleaner'],
    isFeatured: true,
    categoryName: 'Interior Care',
  },
  {
    name: 'Car Glass Cleaner',
    description: 'Crystal clear finish without streaks.',
    price: 400,
    discountPrice: 0,
    rating: 4.5,
    numReviews: 75,
    stock: 60,
    badge: '15% OFF',
    image: 'https://i.ibb.co.com/359SZZ80/Car-Glass-Cleaner.jpg',
    tags: ['glass', 'cleaner', 'exterior'],
    isFeatured: false,
    categoryName: 'Cleaning Products',
  },
  {
    name: 'Premium Car Wax',
    description: 'Adds shine and paint protection.',
    price: 1450,
    discountPrice: 0,
    rating: 4.8,
    numReviews: 164,
    stock: 35,
    badge: 'Premium',
    image: 'https://i.ibb.co.com/Ngtrqp4Y/Premium-Car-Wax.jpg',
    tags: ['wax', 'protection', 'exterior'],
    isFeatured: true,
    categoryName: 'Exterior Care',
  },
  {
    name: 'Car Perfume Luxury',
    description: 'Long-lasting premium fragrance for your car.',
    price: 550,
    discountPrice: 0,
    rating: 4.6,
    numReviews: 102,
    stock: 80,
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
    tags: ['perfume', 'luxury', 'interior'],
    isFeatured: false,
    categoryName: 'Perfumes',
  },
  {
    name: 'Pressure Washer Machine',
    description: 'High-pressure washer for professional cleaning.',
    price: 8500,
    discountPrice: 0,
    rating: 4.9,
    numReviews: 88,
    stock: 10,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    tags: ['pressure', 'washer', 'gadget'],
    isFeatured: true,
    categoryName: 'Gadgets',
  },
  {
    name: 'Wheel Cleaning Brush',
    description: 'Soft brush for effective wheel cleaning.',
    price: 300,
    discountPrice: 0,
    rating: 4.4,
    numReviews: 59,
    stock: 90,
    badge: 'Budget',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1200&auto=format&fit=crop',
    tags: ['wheel', 'brush', 'accessories'],
    isFeatured: false,
    categoryName: 'Accessories',
  },
  {
    name: 'Ceramic Coating Kit',
    description: 'Advanced ceramic protection with glossy finish.',
    price: 3200,
    discountPrice: 0,
    rating: 4.9,
    numReviews: 140,
    stock: 15,
    badge: 'Professional',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
    tags: ['ceramic', 'coating', 'protection'],
    isFeatured: true,
    categoryName: 'Protection',
  },
  {
    name: 'Car Seat Cover Set',
    description: 'Comfortable and stylish seat protection.',
    price: 4200,
    discountPrice: 0,
    rating: 4.7,
    numReviews: 110,
    stock: 22,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
    tags: ['seat', 'cover', 'protection'],
    isFeatured: false,
    categoryName: 'Protection',
  },
  {
    name: 'Tyre Inflator Pump',
    description: 'Portable digital tyre inflator with auto-stop.',
    price: 2200,
    discountPrice: 0,
    rating: 4.8,
    numReviews: 95,
    stock: 30,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',
    tags: ['tyre', 'inflator', 'utility'],
    isFeatured: false,
    categoryName: 'Utility',
  },
  {
    name: 'Car Phone Holder',
    description: 'Strong magnetic holder for safe driving.',
    price: 650,
    discountPrice: 0,
    rating: 4.5,
    numReviews: 170,
    stock: 75,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    tags: ['phone', 'holder', 'gadget'],
    isFeatured: false,
    categoryName: 'Gadgets',
  },
  {
    name: 'Car Floor Mat',
    description: 'Heavy-duty floor mat for all-weather protection.',
    price: 2800,
    discountPrice: 0,
    rating: 4.7,
    numReviews: 81,
    stock: 40,
    badge: 'Durable',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=1200&auto=format&fit=crop',
    tags: ['floor', 'mat', 'protection'],
    isFeatured: false,
    categoryName: 'Protection',
  },
  {
    name: 'Steam Cleaning Machine',
    description: 'Professional steam cleaner for deep sanitization.',
    price: 6700,
    discountPrice: 0,
    rating: 4.8,
    numReviews: 66,
    stock: 12,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop',
    tags: ['steam', 'cleaner', 'gadget'],
    isFeatured: true,
    categoryName: 'Gadgets',
  },
  {
    name: 'Waterless Car Wash Spray',
    description: 'Quick clean solution without using water.',
    price: 780,
    discountPrice: 0,
    rating: 4.6,
    numReviews: 101,
    stock: 55,
    badge: 'Eco Friendly',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=1200&auto=format&fit=crop',
    tags: ['waterless', 'eco', 'spray'],
    isFeatured: false,
    categoryName: 'Cleaning Products',
  },
  {
    name: 'Emergency Car Toolkit',
    description: 'Complete emergency toolkit for roadside safety.',
    price: 3600,
    discountPrice: 0,
    rating: 4.9,
    numReviews: 73,
    stock: 18,
    badge: 'Essential',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
    tags: ['toolkit', 'emergency', 'utility'],
    isFeatured: true,
    categoryName: 'Utility',
  },
];

// ── Import ────────────────────────────────────────────────
const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();
    console.log('🗑️  Old data cleared');

    // Service category
    const serviceCategory = await Category.create(categoryData);
    console.log('✅ Service category created:', serviceCategory.name);

    // Shop categories
    const shopCategoryNames = [
      'Cleaning Products', 'Accessories', 'Interior Care',
      'Exterior Care', 'Gadgets', 'Protection', 'Perfumes', 'Utility',
    ];
    const shopCategories = await Category.insertMany(
      shopCategoryNames.map((name) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isActive: true,
      }))
    );
    console.log('✅ Shop categories created');

    // Category name → _id map
    const catMap = {};
    shopCategories.forEach((c) => { catMap[c.name] = c._id; });

    // Services insert
    const servicesWithCategory = services.map((s) => ({
      ...s,
      category: serviceCategory._id,
      isActive: true,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
    await Product.insertMany(servicesWithCategory);
    console.log(`✅ ${services.length} services inserted`);

    // Shop products go only to the ShopProduct collection
    await ShopProduct.deleteMany();
    const shopProductsWithCategory = shopProducts.map((p) => {
      const { categoryName, ...rest } = p;
      return {
        ...rest,                            
        category: catMap[categoryName],
        isActive: true,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };
    });
    await ShopProduct.insertMany(shopProductsWithCategory);
    console.log(`✅ ${shopProducts.length} shop products inserted`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

// ── Destroy ───────────────────────────────────────────────
const destroyData = async () => {
  try {
    await ShopProduct.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();
    console.log('🗑️  All data destroyed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Destroy failed:', error.message);
    process.exit(1);
  }
};

// ── Run ───────────────────────────────────────────────────
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}