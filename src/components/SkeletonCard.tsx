export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>

      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );
}