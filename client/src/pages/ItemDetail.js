import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  ShareIcon, 
  MapPinIcon, 
  StarIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  CheckBadgeIcon,
  ClockIcon,
  TagIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    // Mock item data (would come from API)
    const mockItem = {
      id: parseInt(id),
      title: "Vintage Leather Sofa",
      price: 150,
      negotiable: true,
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80"
      ],
      description: "Beautiful vintage leather sofa in excellent condition. Perfect for any living room. The leather is genuine and has been well-maintained over the years. Some minor wear consistent with age, but overall in great shape. Dimensions: 84\" L x 36\" W x 34\" H. Non-smoking household.",
      location: "Phnom Penh",
      category: "Furniture",
      condition: "Good",
      seller: {
        id: 1,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        reviewCount: 45,
        joinedDate: "2022-03-15",
        isVerified: true,
        responseTime: "Usually responds within 2 hours",
        phone: "+855 12 345 678",
        email: "john.doe@email.com"
      },
      createdAt: "2024-01-15T10:30:00Z",
      views: 127,
      likes: 23,
      tags: ["vintage", "leather", "furniture", "sofa"],
      specifications: {
        "Material": "Genuine Leather",
        "Color": "Brown",
        "Dimensions": "84\" L x 36\" W x 34\" H",
        "Weight": "~85 lbs",
        "Age": "~15 years",
        "Brand": "Unknown"
      }
    };

    setTimeout(() => {
      setItem(mockItem);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }
    setShowContactInfo(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this ${item.title} on DropLink`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/items')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <ShareIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {item.images.length}
                </div>
              </div>
              
              {/* Image Thumbnails */}
              {item.images.length > 1 && (
                <div className="p-4 flex space-x-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-purple-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-purple-600">${item.price}</span>
                  {item.negotiable && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Negotiable
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {item.likes} likes
                  </div>
                  <div className="flex items-center">
                    <CameraIcon className="h-4 w-4 mr-1" />
                    {item.views} views
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{item.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info and Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {/* Seller Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.seller.name}</h3>
                    {item.seller.isVerified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">
                      {item.seller.rating} ({item.seller.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(item.seller.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">{item.seller.responseTime}</p>
                
                {/* Contact Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleContactSeller}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span>Message Seller</span>
                  </button>
                  
                  {showContactInfo && (
                    <div className="space-y-2">
                      <a
                        href={`tel:${item.seller.phone}`}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <PhoneIcon className="h-5 w-5" />
                        <span>Call {item.seller.phone}</span>
                      </a>
                      <a
                        href={`mailto:${item.seller.email}`}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>Email Seller</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Safety Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Check the item before payment</li>
                  <li>• Don't send money in advance</li>
                  <li>• Trust your instincts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;