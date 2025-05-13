import React from 'react';

const SearchCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse border p-4 rounded">
      <div className="h-6 bg-gray-200 rounded mb-2"></div> {/* Title skeleton */}
      <div className="h-4 bg-gray-200 rounded mb-1"></div> {/* Specialization skeleton */}
      <div className="h-4 bg-gray-200 rounded"></div> {/* Course skeleton */}
    </div>
  );
};

export default SearchCardSkeleton;
