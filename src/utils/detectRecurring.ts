interface Transaction {
  note: string;
  amount: number;
  type: string;
}

export function detectRecurringTransactions(
  transactions: Transaction[]
) {
  const map: Record<
    string,
    number
  > = {};

  transactions.forEach((t) => {
    if (
      t.type !== "expense"
    )
      return;

    const key = `${t.note}-${t.amount}`;

    map[key] =
      (map[key] || 0) + 1;
  });

  return Object.entries(map)
    .filter(
      ([_, count]) =>
        count >= 2
    )
    .map(([key]) => {
      const [
        note,
        amount,
      ] = key.split("-");

      return {
        note,
        amount,
      };
    });
}