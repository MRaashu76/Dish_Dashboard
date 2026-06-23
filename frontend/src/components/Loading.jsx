const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <div className="skeleton h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-3 w-1/3 rounded-full" />
      <div className="flex items-center justify-between mt-4">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Displays a grid of skeleton placeholder cards during data loading.
 * @param {{ count?: number }} props
 */
const Loading = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Loading;
