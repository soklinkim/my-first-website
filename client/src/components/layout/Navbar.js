import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const categories = [
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'shoes', name: 'Shoes', icon: '👟' },
    { id: 'vintage', name: 'Vintage', icon: '🏺' },
    { id: 'gadgets', name: 'Gadgets', icon: '📱' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-purple-600">
              DropLink
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              Cambodia's Marketplace
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/post-item"
                  className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Post Item</span>
                </Link>
                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-purple-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-purple-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:block">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to={`/profile/${user._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center space-x-6 py-3 border-t border-gray-200">
          <Link
            to="/items"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/items'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            All Items
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                location.pathname === `/category/${category.id}`
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {/* Categories */}
            <Link
              to="/items"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              All Items
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.icon} {category.name}
              </Link>
            ))}
            
            {/* User Actions */}
            <div className="border-t border-gray-200 pt-2">
              {user ? (
                <>
                  <Link
                    to="/post-item"
                    className="block px-3 py-2 text-sm font-medium text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    + Post Item
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-sm font-medium text-purple-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;