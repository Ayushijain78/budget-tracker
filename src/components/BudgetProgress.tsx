type Budget = {
  category: string;
  limit_amount: number;
};

type Transaction = {
  amount: number;
  category: string;
  type: string;
};

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetProgress({
  budgets,
  transactions,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-5 shadow text-gray-500 border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Budget Limits
      </h2>

      <div className="space-y-5">
        {budgets.map((budget) => {
          const spent = transactions
            .filter(
              (t) =>
                t.type === "expense" &&
                t.category === budget.category
            )
            .reduce(
              (sum, t) => sum + Number(t.amount),
              0
            );

          const percentage =
            (spent / budget.limit_amount) * 100;

          return (
            <div key={budget.category}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">
                  {budget.category}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-300 ">
                  ₹{spent} / ₹
                  {budget.limit_amount}
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${
                    percentage > 100
                      ? "bg-red-500"
                      : percentage > 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
                  }}
                />
              </div>

              {percentage > 100 && (
                <p className="text-red-500 text-sm mt-1">
                  Budget exceeded
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}