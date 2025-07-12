import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

const Favorites = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 mx-auto text-red-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Favorites</h1>
          <p className="text-gray-600">Your favorite items will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Favorites;