"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Budget } from "@/types/budget.type";
import Header from "@/components/Header";
import DashboardCards from "@/components/DashboardCards";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import AddTransactionForm from "@/components/AddTransactionForm";
import BudgetProgress from "@/components/BudgetProgress";
import AddBudgetForm from "@/components/AddBudgetForm";
import AIInsights from "@/components/AIInsights";
import MonthlyAnalytics from "@/components/MonthlyAnalytics";
import EditTransactionModal from "@/components/EditTransactionModal";
import ExportButtons from "@/components/ExportButtons";
import ImportExport from "@/components/ImportExport";
import RecurringTransactions from "@/components/RecurringTransactions";
import TransactionFilters from "@/components/TransactionFilters";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import toast from "react-hot-toast";

import { detectRecurringTransactions } from "@/utils/detectRecurring";
import { Transaction } from "@/types/transactions.type";

/**
 * Home - Main dashboard component for the budget tracker
 * Displays user's financial overview including transactions, budgets, and AI insights
 * Provides functionality to add, edit, delete transactions and manage budgets
 * Requires user authentication to display content
 */
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [insight, setInsight] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const recurringTransactions = detectRecurringTransactions(transactions);
  const [loading, setLoading] = useState(true);
  /**
   * Fetches all budgets for the current user from Supabase
   * @param userId - The ID of the user whose budgets to fetch
   * Sets the budgets state with the fetched data
   */
  const fetchBudgets = async (userId: string) => {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId);

    setBudgets(data || []);
  };
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  /**
   * Fetches all transactions for the current user from Supabase
   * Transactions are ordered by creation date in descending order (newest first)
   * @param userId - The ID of the user whose transactions to fetch
   * Sets the transactions state with the fetched data
   */
  const fetchTransactions = async (userId: string) => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setTransactions(data || []);
    setLoading(false);
  };

  /**
   * Imports transactions from an external source (e.g., CSV file)
   * Adds the user_id to each transaction and inserts them into Supabase
   * @param importedTransactions - Array of transactions to import
   * Refreshes the transactions list after successful import
   */
  async function importTransactions(importedTransactions: any[]): Promise<void> {
    if (!user?.id) return;

    const formatted = importedTransactions.map((t) => ({
      ...t,
      user_id: user.id,
    }));

    const { error } = await supabase.from("transactions").insert(formatted);

    if (error) {
      toast.error("Import failed");
      return;
    }

    fetchTransactions(user.id);
  }
  /**
   * Updates an existing transaction with new data
   * @param id - The ID of the transaction to update
   * @param updatedData - Partial object containing fields to update
   * Refreshes the transactions list after successful update
   */
  async function updateTransaction(
    id: string,
    updatedData: Partial<Transaction>,
  ) {
    const { error } = await supabase
      .from("transactions")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchTransactions(user.id);
  }
  const categoryData = Object.values(
    transactions.reduce((acc: any, curr) => {
      if (curr.type === "expense") {
        if (!acc[curr.category]) {
          acc[curr.category] = {
            name: curr.category,
            value: 0,
          };
        }
        acc[curr.category].value += Number(curr.amount);
      }
      return acc;
    }, {}),
  );
  /**
   * Handles adding a new transaction to the database
   * Creates a new transaction with the provided data and user_id
   * @param data - Object containing amount, note, type, and category of the transaction
   * Refreshes the transactions list after successful insertion
   */
  async function handleAddTransaction(data: {
    amount: number;
    note: string;
    type: string;
    category: string;
  }) {
    const { error } = await supabase.from("transactions").insert([
      {
        amount: data.amount,
        note: data.note,
        type: data.type,
        category: data.category,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log(error);
      return;
    }

    fetchTransactions(user.id); // 🔄 refresh list
  }

  /**
   * Deletes a transaction after user confirmation
   * Prompts the user to confirm before deleting
   * @param id - The ID of the transaction to delete
   * Refreshes the transactions list after successful deletion
   */
  const deleteTransaction = async (id: string) => {
    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) return;

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchTransactions(user.id);
  };
  /**
   * Handles adding a new budget for a specific category
   * Creates a budget with the specified category and spending limit
   * @param category - The category for which to set the budget
   * @param limitAmount - The maximum spending limit for the category
   * Refreshes the budgets list after successful insertion
   */
  async function handleAddBudget(category: string, limitAmount: number) {
    const { error } = await supabase.from("budgets").insert([
      {
        category,
        limit_amount: limitAmount,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log(error);
      return;
    }

    fetchBudgets(user.id);
  }

  /**
   * Generates AI-powered insights based on current transactions
   * Calls the /api/insights endpoint with transaction data
   * Sets loading state during the request and handles errors gracefully
   * @updates insight state with generated AI insights or error message
   */
  async function generateInsights() {
    try {
      setInsightLoading(true);

      const res = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions,
        }),
      });

      if (!res.ok) {
        setInsight("Unable to generate insights.");

        return;
      }

      const data = await res.json();

      setInsight(data.insight);
    } catch (err) {
      console.log(err);

      setInsight("Something went wrong.");
    } finally {
      setInsightLoading(false);
    }
  }

  /**
   * Effect hook that runs on component mount
   * Fetches the current authenticated user from Supabase
   * If user exists, loads their transactions and budgets
   * Runs once when the component is mounted
   */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser(data.user);
        fetchTransactions(data.user.id); // pass id
        fetchBudgets(data.user.id);
      }
    };

    getUser();
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <p>You are not logged in</p>
        <a href="/login" className="text-blue-500">
          Go to Login
        </a>
      </div>
    );
  }
  function clearFilters() {
    setSearch("");
    setFilterCategory("All");
    setFilterType("All");
    setStartDate("");
    setEndDate("");
  }
  const filteredTransactions = transactions.filter((t) => {
    // Search
    const matchesSearch = t.note.toLowerCase().includes(search.toLowerCase());

    // Category
    const matchesCategory =
      filterCategory === "All" || t.category === filterCategory;

    // Type
    const matchesType = filterType === "All" || t.type === filterType;

    // Date
    const transactionDate = new Date(t.created_at);

    const matchesStart = !startDate || transactionDate >= new Date(startDate);

    const matchesEnd = !endDate || transactionDate <= new Date(endDate);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStart &&
      matchesEnd
    );
  });
  return (
    <div className="min-h-screen text-black dark:text-white bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <DashboardCards income={totalIncome} expense={totalExpense} />

        <Header email={user.email} />
        <AddTransactionForm onAdd={handleAddTransaction} />

        {/* Transaction List */}
        <div>
          <h2 className="font-semibold mb-2">Transactions</h2>

          {transactions.length === 0 && (
            <p className="text-gray-500 dark:text-gray-300 ">
              No transactions yet
            </p>
          )}
          <TransactionFilters
            search={search}
            setSearch={setSearch}
            category={filterCategory}
            setCategory={setFilterCategory}
            type={filterType}
            setType={setFilterType}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            clearFilters={clearFilters}
          />
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
            onEdit={(transaction) => {
              setSelectedTransaction(transaction);
              setEditOpen(true);
            }}
          />
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Expense Breakdown</h2>

          <div className="w-full h-64">
            {categoryData.length === 0 && (
              <p className="text-gray-500 dark:text-gray-300 ">
                No data for chart
              </p>
            )}
            <ExpenseChart transactions={transactions} />
            <AIInsights
              insight={insight}
              loading={insightLoading}
              onGenerate={generateInsights}
            />
            <RecurringTransactions recurring={recurringTransactions} />
            <MonthlyAnalytics transactions={transactions} />
            <ImportExport onImport={importTransactions} />
            <ExportButtons transactions={transactions} />
            <AddBudgetForm onAddBudget={handleAddBudget} />
            <BudgetProgress budgets={budgets} transactions={transactions} />
          </div>
        </div>
      </div>
      <EditTransactionModal
        open={editOpen}
        transaction={selectedTransaction}
        onClose={() => setEditOpen(false)}
        onSave={updateTransaction}
      />
    </div>
  );
}
