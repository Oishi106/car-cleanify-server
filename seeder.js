const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const { Category, Cart } = require('./models/Category');

connectDB();

// ── Category ──────────────────────────────────────────────
const categoryData = {
  name: 'Car Cleaning',
  slug: 'car-cleaning',
  description: 'Professional car cleaning and detailing services',
  isActive: true,
};

// ── Services / Products ───────────────────────────────────
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

// ── Import ────────────────────────────────────────────────
const importData = async () => {
  try {
    // সব clear করো
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();

    console.log('🗑️  Old data cleared');

    // Category আগে বানাও
    const category = await Category.create(categoryData);
    console.log('✅ Category created:', category.name);

   const servicesWithCategory = services.map((s) => ({
  ...s,
  category: category._id,
  isActive: true,
  slug: s.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, ''),
}));

    const inserted = await Product.insertMany(servicesWithCategory);
    console.log(`✅ ${inserted.length} services inserted`);

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