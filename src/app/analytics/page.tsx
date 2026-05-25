"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  note: string;
  type: string;
  category: string;
  created_at: string;
};

const COLORS = [
  "#facc15",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#34d399",
  "#94a3b8",
];

export default function AnalyticsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  async function fetchTransactions() {
    const { data: userData } =
      await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } =
      await supabase
        .from("transactions")
        .select("*")
        .eq(
          "user_id",
          userData.user.id
        );

    setTransactions(data || []);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const expenses =
    transactions.filter(
      (t) =>
        t.type === "expense"
    );

  const incomes =
    transactions.filter(
      (t) =>
        t.type === "income"
    );

  const totalExpense =
    expenses.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const totalIncome =
    incomes.reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );

  const savings =
    totalIncome - totalExpense;

  // Category chart
  const categoryMap: any = {};

  expenses.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[
        t.category
      ] || 0) +
      Number(t.amount);
  });

  const categoryData =
    Object.entries(
      categoryMap
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

  // Monthly trends
  const monthlyMap: any = {};

  transactions.forEach((t) => {
    const month =
      new Date(
        t.created_at
      ).toLocaleString(
        "default",
        {
          month: "short",
        }
      );

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,
        income: 0,
        expense: 0,
      };
    }

    if (t.type === "income") {
      monthlyMap[
        month
      ].income += Number(
        t.amount
      );
    } else {
      monthlyMap[
        month
      ].expense += Number(
        t.amount
      );
    }
  });

  const monthlyData =
    Object.values(monthlyMap);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl sm:text-3xl font-bold mb-6 dark:text-white">
          Analytics Dashboard
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Total Income
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-green-500">
              ₹{totalIncome}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Total Expense
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-red-500">
              ₹{totalExpense}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-gray-500">
              Savings
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-500">
              ₹{savings}
            </h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Expense Breakdown
            </h2>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={
                      categoryData
                    }
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {categoryData.map(
                      (
                        _,
                        index
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Monthly Trends
            </h2>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart
                  data={
                    monthlyData
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="income" fill="#22c55e" />

                  <Bar dataKey="expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}