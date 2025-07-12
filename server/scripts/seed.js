const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Item = require('../models/Item');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/droplink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample data
const categories = [
  {
    name: 'Electronics',
    nameKh: 'គ្រឿងអេឡិចត្រូនិក',
    description: 'Electronic devices and gadgets',
    icon: '📱',
    color: '#3b82f6',
    subcategories: [
      { name: 'Smartphones', nameKh: 'ទូរស័ព្ទស្មាតហ្វូន' },
      { name: 'Laptops', nameKh: 'កុំព្យូទ័រយួរដៃ' },
      { name: 'Tablets', nameKh: 'ថេបប្លេត' },
      { name: 'Headphones', nameKh: 'កាសអាំស្រឡាញ់' },
      { name: 'Cameras', nameKh: 'ម៉ាស៊ីនថតរូប' }
    ]
  },
  {
    name: 'Furniture',
    nameKh: 'គ្រឿងសង្ហារឹម',
    description: 'Home and office furniture',
    icon: '🪑',
    color: '#10b981',
    subcategories: [
      { name: 'Chairs', nameKh: 'កៅអី' },
      { name: 'Tables', nameKh: 'តុ' },
      { name: 'Beds', nameKh: 'គ្រែ' },
      { name: 'Sofas', nameKh: 'កៅអីយូរ' },
      { name: 'Cabinets', nameKh: 'ទូ' }
    ]
  },
  {
    name: 'Clothing',
    nameKh: 'សំលៀកបំពាក់',
    description: 'Fashion and apparel',
    icon: '👕',
    color: '#f59e0b',
    subcategories: [
      { name: 'Shirts', nameKh: 'អាវ' },
      { name: 'Pants', nameKh: 'ខោ' },
      { name: 'Dresses', nameKh: 'រ៉ូប' },
      { name: 'Shoes', nameKh: 'ស្បែកជើង' },
      { name: 'Accessories', nameKh: 'គ្រឿងបន្លាស់' }
    ]
  },
  {
    name: 'Books & Stationery',
    nameKh: 'សៀវភៅ និង អ្រាបសំណង',
    description: 'Books, notebooks, and stationery items',
    icon: '📚',
    color: '#8b5cf6',
    subcategories: [
      { name: 'Textbooks', nameKh: 'សៀវភៅសិក្សា' },
      { name: 'Novels', nameKh: 'ប្រលោមលោក' },
      { name: 'Notebooks', nameKh: 'កូនសៀវភៅ' },
      { name: 'Pens', nameKh: 'ប៊ិច' },
      { name: 'Art Supplies', nameKh: 'គ្រឿងឡាតក្រច' }
    ]
  },
  {
    name: 'Household Items',
    nameKh: 'គ្រឿងប្រើប្រាស់ក្នុងផ្ទះ',
    description: 'Kitchen appliances and household gadgets',
    icon: '🏠',
    color: '#ef4444',
    subcategories: [
      { name: 'Kitchen Appliances', nameKh: 'គ្រឿងបាញ់ចំអិន' },
      { name: 'Cleaning Supplies', nameKh: 'គ្រឿងសម្អាត' },
      { name: 'Storage', nameKh: 'ធុងរាប' },
      { name: 'Decor', nameKh: 'គ្រឿងតុបតែង' },
      { name: 'Tools', nameKh: 'ឧបករណ៍' }
    ]
  },
  {
    name: 'Vintage Items',
    nameKh: 'របស់អតីតកាល',
    description: 'Vintage and antique items',
    icon: '🏺',
    color: '#6b7280',
    subcategories: [
      { name: 'Antiques', nameKh: 'របស់បុរាណ' },
      { name: 'Collectibles', nameKh: 'របស់កម្រ' },
      { name: 'Vintage Clothing', nameKh: 'សំលៀកបំពាក់បុរាណ' },
      { name: 'Vintage Electronics', nameKh: 'គ្រឿងអេឡិចត្រូនិកបុរាណ' },
      { name: 'Vintage Furniture', nameKh: 'គ្រឿងសង្ហារឹមបុរាណ' }
    ]
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    phone: '0123456789',
    idCard: {
      frontImage: '/uploads/ids/sample-id-front.jpg',
      backImage: '/uploads/ids/sample-id-back.jpg',
      idNumber: '123456789012',
      verified: true
    },
    location: {
      province: 'Phnom Penh',
      city: 'Phnom Penh',
      district: 'Chamkar Mon',
      address: '123 Main Street',
      coordinates: { lat: 11.5564, lng: 104.9282 }
    },
    bio: 'Selling quality second-hand items',
    profileImage: '/uploads/profiles/sample-profile.jpg',
    rating: { average: 4.5, count: 12 },
    totalSales: 5
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '123456',
    phone: '0987654321',
    idCard: {
      frontImage: '/uploads/ids/sample-id-front2.jpg',
      backImage: '/uploads/ids/sample-id-back2.jpg',
      idNumber: '987654321012',
      verified: true
    },
    location: {
      province: 'Siem Reap',
      city: 'Siem Reap',
      district: 'Siem Reap',
      address: '456 Oak Avenue',
      coordinates: { lat: 13.3671, lng: 103.8448 }
    },
    bio: 'Love vintage and unique items',
    profileImage: '/uploads/profiles/sample-profile2.jpg',
    rating: { average: 4.8, count: 8 },
    totalSales: 3
  },
  {
    name: 'Admin User',
    email: 'admin@droplink.com',
    password: 'admin123456',
    phone: '0555555555',
    idCard: {
      frontImage: '/uploads/ids/admin-id-front.jpg',
      backImage: '/uploads/ids/admin-id-back.jpg',
      idNumber: '555555555555',
      verified: true
    },
    location: {
      province: 'Phnom Penh',
      city: 'Phnom Penh',
      district: 'Daun Penh',
      address: 'Admin Office',
      coordinates: { lat: 11.5564, lng: 104.9282 }
    },
    bio: 'DropLink Administrator',
    isAdmin: true,
    rating: { average: 5.0, count: 1 },
    totalSales: 0
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});

    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create sample items
    const sampleItems = [
      {
        title: 'iPhone 12 Pro - Excellent Condition',
        description: 'Selling my iPhone 12 Pro in excellent condition. No scratches, original box included. Perfect for students or anyone looking for a high-quality smartphone.',
        price: 750,
        originalPrice: 1200,
        currency: 'USD',
        category: createdCategories[0]._id, // Electronics
        subcategory: 'Smartphones',
        condition: 'Like New',
        images: [
          { url: '/uploads/items/iphone12.jpg', alt: 'iPhone 12 Pro', isPrimary: true }
        ],
        seller: createdUsers[0]._id,
        location: {
          province: 'Phnom Penh',
          city: 'Phnom Penh',
          district: 'Chamkar Mon',
          address: '123 Main Street',
          coordinates: { lat: 11.5564, lng: 104.9282 }
        },
        specifications: {
          brand: 'Apple',
          model: 'iPhone 12 Pro',
          color: 'Space Gray',
          storage: '128GB'
        },
        tags: ['smartphone', 'apple', 'iphone', 'mobile'],
        isNegotiable: true,
        deliveryOptions: { pickup: true, delivery: true, deliveryFee: 5 },
        paymentMethods: ['Cash', 'ABA', 'Wing'],
        views: 45,
        favoriteCount: 8
      },
      {
        title: 'Vintage Wooden Chair - Antique',
        description: 'Beautiful vintage wooden chair from the 1960s. Solid wood construction, perfect for collectors or anyone who appreciates classic furniture.',
        price: 120,
        originalPrice: 200,
        currency: 'USD',
        category: createdCategories[1]._id, // Furniture
        subcategory: 'Chairs',
        condition: 'Good',
        images: [
          { url: '/uploads/items/vintage-chair.jpg', alt: 'Vintage Wooden Chair', isPrimary: true }
        ],
        seller: createdUsers[1]._id,
        location: {
          province: 'Siem Reap',
          city: 'Siem Reap',
          district: 'Siem Reap',
          address: '456 Oak Avenue',
          coordinates: { lat: 13.3671, lng: 103.8448 }
        },
        specifications: {
          material: 'Solid Wood',
          color: 'Brown',
          year: '1960s',
          style: 'Vintage'
        },
        tags: ['vintage', 'furniture', 'chair', 'antique', 'wood'],
        isNegotiable: true,
        deliveryOptions: { pickup: true, delivery: false },
        paymentMethods: ['Cash'],
        views: 32,
        favoriteCount: 5
      },
      {
        title: 'MacBook Air M1 - 2021',
        description: 'Excellent condition MacBook Air with M1 chip. Perfect for students, professionals, or anyone needing a reliable laptop. Battery life is still excellent.',
        price: 950,
        originalPrice: 1299,
        currency: 'USD',
        category: createdCategories[0]._id, // Electronics
        subcategory: 'Laptops',
        condition: 'Like New',
        images: [
          { url: '/uploads/items/macbook-air.jpg', alt: 'MacBook Air M1', isPrimary: true }
        ],
        seller: createdUsers[0]._id,
        location: {
          province: 'Phnom Penh',
          city: 'Phnom Penh',
          district: 'Chamkar Mon',
          address: '123 Main Street',
          coordinates: { lat: 11.5564, lng: 104.9282 }
        },
        specifications: {
          brand: 'Apple',
          model: 'MacBook Air M1',
          year: 2021,
          processor: 'M1 Chip',
          ram: '8GB',
          storage: '256GB SSD'
        },
        tags: ['laptop', 'apple', 'macbook', 'computer', 'm1'],
        isNegotiable: true,
        deliveryOptions: { pickup: true, delivery: true, deliveryFee: 10 },
        paymentMethods: ['Cash', 'ABA', 'Wing', 'Bank Transfer'],
        views: 78,
        favoriteCount: 15
      },
      {
        title: 'Designer Handbag - Authentic',
        description: 'Authentic designer handbag in great condition. Rarely used, perfect for special occasions. Comes with original packaging.',
        price: 250,
        originalPrice: 500,
        currency: 'USD',
        category: createdCategories[2]._id, // Clothing
        subcategory: 'Accessories',
        condition: 'Like New',
        images: [
          { url: '/uploads/items/designer-bag.jpg', alt: 'Designer Handbag', isPrimary: true }
        ],
        seller: createdUsers[1]._id,
        location: {
          province: 'Siem Reap',
          city: 'Siem Reap',
          district: 'Siem Reap',
          address: '456 Oak Avenue',
          coordinates: { lat: 13.3671, lng: 103.8448 }
        },
        specifications: {
          brand: 'Designer Brand',
          color: 'Black',
          material: 'Leather',
          size: 'Medium'
        },
        tags: ['handbag', 'designer', 'fashion', 'accessories', 'luxury'],
        isNegotiable: true,
        deliveryOptions: { pickup: true, delivery: true, deliveryFee: 8 },
        paymentMethods: ['Cash', 'ABA'],
        views: 25,
        favoriteCount: 3
      },
      {
        title: 'Complete Set of Textbooks - Grade 12',
        description: 'Complete set of Grade 12 textbooks in good condition. Perfect for students preparing for exams. All subjects included.',
        price: 45,
        originalPrice: 120,
        currency: 'USD',
        category: createdCategories[3]._id, // Books
        subcategory: 'Textbooks',
        condition: 'Good',
        images: [
          { url: '/uploads/items/textbooks.jpg', alt: 'Grade 12 Textbooks', isPrimary: true }
        ],
        seller: createdUsers[0]._id,
        location: {
          province: 'Phnom Penh',
          city: 'Phnom Penh',
          district: 'Chamkar Mon',
          address: '123 Main Street',
          coordinates: { lat: 11.5564, lng: 104.9282 }
        },
        specifications: {
          grade: 'Grade 12',
          subjects: 'All Subjects',
          language: 'English',
          condition: 'Good'
        },
        tags: ['textbooks', 'education', 'grade12', 'study', 'books'],
        isNegotiable: true,
        deliveryOptions: { pickup: true, delivery: true, deliveryFee: 3 },
        paymentMethods: ['Cash', 'ABA', 'Wing'],
        views: 15,
        favoriteCount: 2
      }
    ];

    const createdItems = await Item.insertMany(sampleItems);
    console.log(`Created ${createdItems.length} items`);

    // Update category item counts
    for (const category of createdCategories) {
      const itemCount = await Item.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { itemCount });
    }

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Regular User: john@example.com / 123456');
    console.log('Admin User: admin@droplink.com / admin123456');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();