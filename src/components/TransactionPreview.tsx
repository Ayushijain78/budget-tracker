'use client';

import { useState } from 'react';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
}

interface Props {
  transactions: Transaction[];
  onSave?: (transactions: Transaction[]) => void;
}

export default function TransactionPreview({
  transactions,
  onSave,
}: Props) {
  const [editedTransactions, setEditedTransactions] =
    useState<Transaction[]>(transactions);

  const handleEdit = (
    index: number,
    field: keyof Transaction,
    value: any,
  ) => {
    const updated = [...editedTransactions];
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? parseFloat(value) : value,
    };
    setEditedTransactions(updated);
  };

  const handleSave = () => {
    onSave?.(editedTransactions);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions to preview
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {editedTransactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={tx.date}
                    onChange={(e) =>
                      handleEdit(idx, 'date', e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={tx.description}
                    onChange={(e) =>
                      handleEdit(
                        idx,
                        'description',
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={tx.amount}
                    onChange={(e) =>
                      handleEdit(idx, 'amount', e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={tx.type}
                    onChange={(e) =>
                      handleEdit(
                        idx,
                        'type',
                        e.target.value as 'income' | 'expense',
                      )
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={tx.category || ''}
                    onChange={(e) =>
                      handleEdit(
                        idx,
                        'category',
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onSave && (
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Transactions
        </button>
      )}
    </div>
  );
}
