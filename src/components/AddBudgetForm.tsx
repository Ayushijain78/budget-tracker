"use client";

import { useState } from "react";

interface Props {
  onAddBudget: (
    category: string,
    limitAmount: number
  ) => Promise<void>;
}

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
];

export default function AddBudgetForm({
  onAddBudget,
}: Props) {
  const [category, setCategory] =
    useState("Food");

  const [limitAmount, setLimitAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    if (!limitAmount) return;

    setLoading(true);

    await onAddBudget(
      category,
      Number(limitAmount)
    );

    setLimitAmount("");

    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow text-gray-500 border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Set Budget
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="text-gray-500 border dark:border-gray-700 rounded-xl p-6"
        >
          {categories.map((cat) => (
            <option key={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget Amount"
          value={limitAmount}
          onChange={(e) =>
            setLimitAmount(e.target.value)
          }
          className="text-gray-500 border dark:border-gray-700 rounded-xl p-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white rounded-xl px-4"
        >
          {loading
            ? "Saving..."
            : "Save Budget"}
        </button>
      </div>
    </div>
  );
}