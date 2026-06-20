interface Props {
  transactions: any[];
  onClose: () => void;
  onImport: () => void;
}

export default function PDFImportPreview({
  transactions,
  onClose,
  onImport,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-5xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Parsed Transactions ({transactions.length})
          </h2>

          <button
            onClick={onClose}
            className="border px-3 py-1 rounded"
          >
            Close
          </button>
             <button
  onClick={onImport}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Import {transactions.length} Transactions
</button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Note</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Type</th>
                 <td className="p-2">category</td>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">{t.note}</td>
                  <td className="p-2">₹{t.amount}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">{t.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   
    </div>
  );
}