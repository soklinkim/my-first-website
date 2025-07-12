import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PlusIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    negotiable: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'shoes', name: 'Shoes', icon: '👟' },
    { id: 'vintage', name: 'Vintage', icon: '🏺' },
    { id: 'gadgets', name: 'Gadgets', icon: '📱' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'jewelry', name: 'Jewelry', icon: '💍' },
    { id: 'others', name: 'Others', icon: '📦' },
  ];

  const conditions = [
    { id: 'new', name: 'New', description: 'Brand new, unused' },
    { id: 'like-new', name: 'Like New', description: 'Used once or twice' },
    { id: 'excellent', name: 'Excellent', description: 'Very good condition' },
    { id: 'good', name: 'Good', description: 'Normal wear and tear' },
    { id: 'fair', name: 'Fair', description: 'Obvious signs of use' },
    { id: 'poor', name: 'Poor', description: 'Heavy wear or damage' },
  ];

  const locations = [
    'Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampong Cham',
    'Kampot', 'Kep', 'Kratie', 'Mondulkiri', 'Ratanakiri', 'Stung Treng',
    'Preah Vihear', 'Oddar Meanchey', 'Banteay Meanchey', 'Pursat',
    'Kampong Chhnang', 'Kampong Speu', 'Kampong Thom', 'Kandal', 'Takeo',
    'Svay Rieng', 'Prey Veng', 'Koh Kong', 'Pailin', 'Tbong Khmum',
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error('Please enter a title');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Please enter a description');
        return;
      }
      if (!formData.price || formData.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      if (!formData.condition) {
        toast.error('Please select a condition');
        return;
      }
      if (!formData.location) {
        toast.error('Please select a location');
        return;
      }
      if (images.length === 0) {
        toast.error('Please add at least one image');
        return;
      }

      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('price', formData.price);
      uploadData.append('category', formData.category);
      uploadData.append('condition', formData.condition);
      uploadData.append('location', formData.location);
      uploadData.append('negotiable', formData.negotiable);

      // Add images
      images.forEach((image, index) => {
        uploadData.append('images', image.file);
      });

      const response = await axios.post('/api/items', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Item posted successfully!');
      navigate(`/items/${response.data._id}`);
    } catch (error) {
      console.error('Error posting item:', error);
      toast.error(error.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Post Your Item</h1>
            <p className="text-purple-100 mt-1">Share your item with the DropLink community</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <PhotoIcon className="h-5 w-5 inline mr-2" />
                Photos (Required)
              </label>
              <div className="grid grid-cols-1 gap-4">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop your images here'
                      : 'Drag & drop images here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Up to 5 images, max 5MB each
                  </p>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="h-5 w-5 inline mr-2" />
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What are you selling?"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your item in detail..."
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-5 w-5 inline mr-2" />
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Price is negotiable</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condition
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conditions.map((condition) => (
                  <label key={condition.id} className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value={condition.id}
                      checked={formData.condition === condition.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{condition.name}</div>
                      <div className="text-xs text-gray-500">{condition.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-5 w-5 inline mr-2" />
                Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostItem;