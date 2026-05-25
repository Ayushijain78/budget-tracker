import { Transaction } from "@/types/transactions.type";
interface Props {
  transactions: Transaction[];
}

export default function MonthlyAnalytics({
  transactions,
}: Props) {
  const now = new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const currentMonthExpenses =
    transactions.filter((t) => {
      const date = new Date(
        t.created_at
      );

      return (
        t.type === "expense" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() ===
          currentYear
      );
    });

  const previousMonthExpenses =
    transactions.filter((t) => {
      const date = new Date(
        t.created_at
      );

      return (
        t.type === "expense" &&
        date.getMonth() ===
          currentMonth - 1 &&
        date.getFullYear() ===
          currentYear
      );
    });

  const currentTotal =
    currentMonthExpenses.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const previousTotal =
    previousMonthExpenses.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const growth =
    previousTotal === 0
      ? 0
      : (
          ((currentTotal -
            previousTotal) /
            previousTotal) *
          100
        ).toFixed(1);

  const categoryTotals =
    currentMonthExpenses.reduce(
      (
        acc: Record<string, number>,
        curr
      ) => {
        acc[curr.category] =
          (acc[curr.category] || 0) +
          Number(curr.amount);

        return acc;
      },
      {}
    );

  const topCategory =
    Object.entries(categoryTotals)
      .sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "None";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-5 dark:text-white">
        Monthly Analytics
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            This Month
          </p>

          <h3 className="text-xl sm:text-2xl font-bold mt-2 dark:text-white">
            ₹{currentTotal}
          </h3>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Spending Growth
          </p>

          <h3
            className={`text-xl sm:text-2xl font-bold mt-2 ${
              Number(growth) > 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {growth}%
          </h3>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Top Category
          </p>

          <h3 className="text-xl sm:text-2xl font-bold mt-2 dark:text-white">
            {topCategory}
          </h3>
        </div>
      </div>
    </div>
  );
}