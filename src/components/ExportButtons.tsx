type Transaction = {
  amount: number;
  note: string;
  type: string;
  category: string;
  created_at: string;
};

interface Props {
  transactions: Transaction[];
}

export default function ExportButtons({
  transactions,
}: Props) {
  function exportCSV() {
    if (!transactions.length) return;

    const headers = [
      "Amount",
      "Note",
      "Type",
      "Category",
      "Created At",
    ];

    const rows = transactions.map(
      (t) => [
        t.amount,
        t.note,
        t.type,
        t.category,
        new Date(
          t.created_at
        ).toLocaleString(),
      ]
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "transactions.csv";

    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={exportCSV}
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        Export CSV
      </button>
    </div>
  );
}