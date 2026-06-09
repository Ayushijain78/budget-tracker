"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Transaction } from "@/types/transactions.type";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  lastTransactionRef?: (node: HTMLDivElement | null) => void;
}

const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "💡",
  Salary: "💰",
  Other: "📦",
};

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
  lastTransactionRef,
}: Props) {
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const groupedByMonth = transactions.reduce(
    (acc: Record<string, Transaction[]>, transaction) => {
      const month = new Date(transaction.created_at).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(transaction);

      return acc;
    },
    {},
  );

  useEffect(() => {
    const months = Object.keys(groupedByMonth);

    if (months.length > 0 && !openMonth) {
      setOpenMonth(months[0]);
    }
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700 mt-6">
        <p className="text-center text-gray-500 dark:text-gray-300">
          📭 No transactions yet
        </p>
      </div>
    );
  }
  const getMonthSummary = (transactions: Transaction[]) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Recent Transactions
      </h2>

      <div className="max-h-150 overflow-y-auto pr-2 space-y-4">
        {Object.entries(groupedByMonth).map(([month, items], monthIndex) => {
          const summary = getMonthSummary(items);
          return (
            <div
              key={month}
              className="border rounded-xl overflow-hidden dark:border-gray-700"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenMonth(openMonth === month ? null : month)}
                className="w-full flex justify-between p-4 bg-gray-100 dark:bg-gray-900 items-start"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h3 className="font-semibold dark:text-white">{month}</h3>

                      <p className="text-sm text-gray-500">
                        {items.length} transactions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Income</p>

                      <p className="font-semibold text-green-600">
                        ₹{summary.income}
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Expense</p>

                      <p className="font-semibold text-red-600">
                        ₹{summary.expense}
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Balance</p>

                      <p className="font-semibold text-blue-600">
                        ₹{summary.balance}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {items.length} transactions
                  </span>

                  <span className="dark:text-white">
                    {openMonth === month ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Accordion Content */}
              {openMonth === month && (
                <div className="p-3 space-y-3 max-h-175 overflow-y-auto">
                  {items.map((transaction, index) => {
                    const isLastMonth =
                      monthIndex === Object.entries(groupedByMonth).length - 1;

                    const isLastTransaction = index === items.length - 1;

                    return (
                      <motion.div
                        key={transaction.id}
                        ref={
                          isLastMonth && isLastTransaction
                            ? lastTransactionRef
                            : null
                        }
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        whileHover={{
                          scale: 1.01,
                        }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-sm border dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          {/* Left Side */}
                          <div className="flex gap-3">
                            <div className="text-2xl">
                              {categoryIcons[transaction.category] || "📦"}
                            </div>

                            <div>
                              <p className="font-medium dark:text-white">
                                {transaction.note || "Untitled"}
                              </p>

                              <div className="flex gap-2 items-center mt-1">
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full dark:text-gray-300">
                                  {transaction.category}
                                </span>

                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    transaction.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side */}
                          <div className="text-right">
                            <p
                              className={`font-bold text-lg ${
                                transaction.type === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}₹
                              {transaction.amount}
                            </p>

                            <div className="flex gap-2 mt-2 justify-end">
                              <button
                                onClick={() => onEdit(transaction)}
                                className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => onDelete(transaction.id)}
                                className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
