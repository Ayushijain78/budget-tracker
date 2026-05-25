interface Props {
  income: number;
  expense: number;
}

export default function DashboardCards({
  income,
  expense,
}: Props) {
  const balance = income - expense;

  const cards = [
    {
      title: "Balance",
      value: balance,
    },
    {
      title: "Income",
      value: income,
    },
    {
      title: "Expense",
      value: expense,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 text-gray-500 border dark:border-gray-700"
        >
          <p className="text-gray-500 dark:text-gray-300  text-sm">{card.title}</p>

          <h2 className="text-xl sm:text-2xl font-bold mt-2">
            ₹{card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}