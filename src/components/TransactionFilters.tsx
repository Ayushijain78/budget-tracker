"use client";

interface Props {
  search: string;
  setSearch: (
    value: string
  ) => void;

  category: string;
  setCategory: (
    value: string
  ) => void;

  type: string;
  setType: (
    value: string
  ) => void;

  startDate: string;
  setStartDate: (
    value: string
  ) => void;

  endDate: string;
  setEndDate: (
    value: string
  ) => void;

  clearFilters: () => void;
}

const categories = [
  "All",
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Salary",
  "Other",
];

export default function TransactionFilters({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  clearFilters,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search transaction..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 flex-1 min-w-[220px] dark:bg-gray-700 dark:text-white"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 dark:bg-gray-700 dark:text-white"
        >
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">
            All Types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 dark:bg-gray-700 dark:text-white"
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 dark:bg-gray-700 dark:text-white"
        />

        {/* Clear */}
        <button
          onClick={clearFilters}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Clear
        </button>
      </div>
    </div>
  );
}