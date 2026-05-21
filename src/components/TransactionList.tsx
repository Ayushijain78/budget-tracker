type Transaction = {
  id: string;
  amount: number;
  note: string;
  type: string;
  category: string;
};

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-6 shadow text-gray-500 border dark:border-gray-700 mt-6">
        <p className="text-gray-500 dark:text-gray-300  text-center">
          No transactions yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-5 shadow text-gray-500 border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between text-gray-500 border dark:border-gray-700 rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{transaction.note}</p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-300 ">
                  {transaction.category}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    transaction.type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <h3
                className={`font-bold text-lg ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{transaction.amount}
              </h3>

              <button
                onClick={() => onDelete(transaction.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => onEdit(transaction)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
