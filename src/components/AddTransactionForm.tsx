"use client";

import { useState } from "react";

interface Props {
  onAdd: (data: {
    amount: number;
    note: string;
    type: string;
    category: string;
  }) => Promise<void>;
}

export default function AddTransactionForm({
  onAdd,
}: Props) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] =
    useState("Other");

  const [loading, setLoading] =
    useState(false);

  let debounceTimer: NodeJS.Timeout;

  async function handleNoteChange(
    value: string
  ) {
    setNote(value);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      if (value.length < 3) return;

      try {
        const res = await fetch(
          "/api/categorize",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              text: value,
            }),
          }
        );

        const data = await res.json();

        if (data.category) {
          setCategory(data.category);
        }
      } catch (err) {
        console.log("AI failed");
      }
    }, 500);
  }

  async function handleSubmit() {
    if (!amount || !note) return;

    setLoading(true);

    await onAdd({
      amount: Number(amount),
      note,
      type,
      category,
    });

    setAmount("");
    setNote("");
    setCategory("Other");
    setType("expense");

    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow text-gray-500 border dark:border-gray-700 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Add Transaction
      </h2>

      <div className="grid gap-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="text-gray-500 border dark:border-gray-700 rounded-xl p-6 outline-none"
        />

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) =>
            handleNoteChange(e.target.value)
          }
          className="text-gray-500 border dark:border-gray-700 rounded-xl p-6 outline-none"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="text-gray-500 border dark:border-gray-700 rounded-xl p-6 outline-none"
        >
          <option value="expense">
            Expense
          </option>

          <option value="income">
            Income
          </option>
        </select>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-300 ">
            Category:
            <span className="font-semibold ml-2">
              {category}
            </span>
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            {loading
              ? "Adding..."
              : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}