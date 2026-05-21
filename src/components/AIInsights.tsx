interface Props {
  insight: string;
  loading: boolean;
  onGenerate: () => void;
}

export default function AIInsights({
  insight,
  loading,
  onGenerate,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-white">
          AI Financial Insights
        </h2>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          {loading
            ? "Analyzing..."
            : "Generate Insights"}
        </button>
      </div>

      {insight ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
          <p className="text-gray-700 dark:text-gray-200 leading-7">
            {insight}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300">
          No insights generated yet
        </p>
      )}
    </div>
  );
}