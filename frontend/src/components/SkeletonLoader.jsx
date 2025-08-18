import React from 'react';

const SkeletonLoader = ({ type = 'product', count = 8 }) => {
  const renderProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg w-full aspect-[3/4] mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const renderFilterSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === 'filter') {
    return renderFilterSkeleton();
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderProductSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
