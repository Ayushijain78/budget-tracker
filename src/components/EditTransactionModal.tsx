"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types/transactions.type";


interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    updatedData: Partial<Transaction>
  ) => Promise<void>;
}

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Other",
];

export default function EditTransactionModal({
  transaction,
  open,
  onClose,
  onSave,
}: Props) {
  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [type, setType] =
    useState("expense");

  const [category, setCategory] =
    useState("Other");

  useEffect(() => {
    if (transaction) {
      setAmount(
        String(transaction.amount)
      );

      setNote(transaction.note);

      setType(transaction.type);

      setCategory(
        transaction.category
      );
    }
  }, [transaction]);

  if (!open || !transaction)
    return null;

  async function handleSave() {
    if (!transaction) return;
    await onSave(transaction.id, {
      amount: Number(amount),
      note,
      type,
      category,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 dark:text-white">
          Edit Transaction
        </h2>

        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="w-full border dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            className="w-full border dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-700 dark:text-white"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full border dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>
          </select>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full border dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-700 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-6 pt-2">
            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-xl dark:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}