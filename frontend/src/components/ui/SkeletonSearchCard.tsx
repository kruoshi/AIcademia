const SearchCardSkeleton = () => {
  return (
    <div className="break-inside-avoid border border-grey bg-white rounded-xl shadow-md/15 p-4 h-auto mb-4 animate-pulse">
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1.5">
          <span className="flex gap-1.5 items-center bg-gray-200 px-2.5 py-0.5 rounded-full">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div className="w-6 h-3 bg-gray-300 rounded" />
          </span>
          <span className="flex gap-1.5 items-center bg-gray-200 px-2.5 py-0.5 rounded-full">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div className="w-12 h-3 bg-gray-300 rounded" />
          </span>
        </div>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="my-4 md:my-5">
        <div className="w-3/4 h-4 bg-gray-300 rounded" />
      </div>

      <div className="relative mb-2">
        <span className="absolute w-4 h-0.5 bg-gray-300 top-1/2"></span>
        <div className="ml-6 w-1/4 h-3 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default SearchCardSkeleton;
