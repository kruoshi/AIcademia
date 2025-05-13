import React from 'react';

const SearchCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse break-inside-avoid border border-grey bg-white rounded-xl shadow-md/15 p-4 h-auto mb-4">
      {/* Top section with course/specialization and bookmark */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-1.5">
          {/* Course skeleton */}
          <span className="flex gap-1.5 items-center bg-gray-200 px-2.5 py-0.5 rounded-full w-20 h-6"></span>
          
          {/* Specialization skeleton */}
          <span className="flex gap-1.5 items-center bg-gray-200 px-2.5 py-0.5 rounded-full w-20 h-6"></span>
        </div>
        {/* Bookmark skeleton */}
        <div className="border p-1.5 sm:p-2 rounded-full bg-gray-200 w-6 h-6"></div>
      </div>

      {/* Title skeleton */}
      <div className="my-4 md:my-5 bg-gray-200 rounded h-4 w-full"></div>
      <div className="my-4 md:my-5 bg-gray-200 rounded h-4 w-3/4"></div>

      {/* Date section skeleton */}
      <div className="relative mb-2">
        <span className="absolute w-4 h-0.5 bg-gray-200 top-1/2"></span>
        <div className="ml-6 bg-gray-200 rounded h-3 w-16"></div>
      </div>
    </div>
  );
};

export default SearchCardSkeleton;