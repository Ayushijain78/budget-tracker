interface Props {
  recurring: {
    note: string;
    amount: string;
  }[];
}

export default function RecurringTransactions({
  recurring,
}: Props) {
  if (
    recurring.length === 0
  )
    return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Recurring Transactions
      </h2>

      <div className="space-y-3">
        {recurring.map(
          (item, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white flex justify-between"
            >
              <span>
                {item.note}
              </span>

              <span>
                ₹{item.amount}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}