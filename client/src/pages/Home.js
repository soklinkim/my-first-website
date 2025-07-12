import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for featured items (would come from API)
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        title: "Vintage Leather Sofa",
        price: "$150",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        location: "Phnom Penh",
        category: "Furniture",
        seller: "John Doe",
        rating: 4.8,
        isFavorite: false
      },
      {
        id: 2,
        title: "Designer Sneakers",
        price: "$45",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        location: "Siem Reap",
        category: "Shoes",
        seller: "Jane Smith",
        rating: 4.9,
        isFavorite: true
      },
      {
        id: 3,
        title: "Vintage Camera",
        price: "$280",
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        location: "Battambang",
        category: "Vintage",
        seller: "Mike Johnson",
        rating: 4.7,
        isFavorite: false
      },
      {
        id: 4,
        title: "Smartphone",
        price: "$320",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        location: "Phnom Penh",
        category: "Gadgets",
        seller: "Sarah Lee",
        rating: 4.6,
        isFavorite: false
      }
    ];

    setTimeout(() => {
      setFeaturedItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'furniture', name: 'Furniture', icon: '🪑', count: '1,234' },
    { id: 'clothing', name: 'Clothing', icon: '👕', count: '2,891' },
    { id: 'shoes', name: 'Shoes', icon: '👟', count: '756' },
    { id: 'vintage', name: 'Vintage', icon: '🏺', count: '432' },
    { id: 'gadgets', name: 'Gadgets', icon: '📱', count: '1,876' },
  ];

  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-purple-600" />,
      title: "Trusted Community",
      description: "Join thousands of verified buyers and sellers across Cambodia"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-600" />,
      title: "Safe & Secure",
      description: "Your safety is our priority with secure payment and verification"
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-purple-600" />,
      title: "Quick Deals",
      description: "Find and sell items quickly with our easy-to-use platform"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Items Listed", value: "100K+" },
    { label: "Successful Deals", value: "25K+" },
    { label: "Cities Covered", value: "15+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Amazing
              <span className="block text-yellow-300">Second-Hand Treasures</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Cambodia's trusted marketplace for vintage and second-hand items
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/items"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Browse Items
              </Link>
              <Link
                to="/post-item"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover great deals in every category
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked deals just for you
              </p>
            </div>
            <Link
              to="/items"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <HeartIcon className={`h-4 w-4 ${item.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-purple-600">{item.price}</span>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By {item.seller}</span>
                      <Link
                        to={`/items/${item.id}`}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DropLink?
            </h2>
            <p className="text-xl text-gray-600">
              The best platform for buying and selling second-hand items
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SparklesIcon className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of happy buyers and sellers on DropLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              to="/items"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;