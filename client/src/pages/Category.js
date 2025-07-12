import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Items page with category filter
    navigate(`/items?category=${id}`);
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading category...</p>
      </div>
    </div>
  );
};

export default Category;