"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transactions.type";


interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
];

export default function ExpenseChart({
  transactions,
}: Props) {
  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  const groupedData = expenses.reduce(
    (acc: Record<string, number>, curr) => {
      acc[curr.category] =
        (acc[curr.category] || 0) + curr.amount;

      return acc;
    },
    {}
  );

  const chartData = Object.entries(groupedData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow text-gray-500 border dark:border-gray-700 mt-6">
        <p className="text-gray-500 dark:text-gray-300  text-center">
          No expense data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow text-gray-500 border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Expense Analytics
      </h2>

      <div className="w-full h-75 sm:h-100">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}