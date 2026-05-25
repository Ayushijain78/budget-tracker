import SkeletonCard from "./SkeletonCard";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart */}
      <div className="animate-pulse bg-white dark:bg-gray-800 p-5 rounded-2xl shadow h-80"></div>

      {/* Transactions */}
      <div className="animate-pulse bg-white dark:bg-gray-800 p-5 rounded-2xl shadow h-64"></div>
    </div>
  );
}