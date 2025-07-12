import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Items page with search parameters
    const query = searchParams.get('q');
    if (query) {
      navigate(`/items?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/items');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching...</p>
      </div>
    </div>
  );
};

export default Search;