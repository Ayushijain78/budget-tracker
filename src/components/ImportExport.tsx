"use client";

import Papa from "papaparse";
import { categorizeTransaction } from "@/utils/categorizeTransaction";

type Transaction = {
  amount: number;
  note: string;
  type: string;
  category: string;
  created_at?: string;
};

interface Props {
  onImport: (transactions: Transaction[]) => Promise<void>;
}

export default function ImportExport({ onImport }: Props) {
  // ✅ Download sample CSV
  function downloadSampleCSV() {
    const csv = `date,note,amount,type,category
2025-05-01,Zomato Order,450,expense,Food
2025-05-02,Uber Ride,300,expense,Travel
2025-05-03,Salary,50000,income,Salary`;

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "sample-transactions.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // ✅ Upload CSV
  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,

      complete: async (results: any) => {
        const formattedData = results.data
          .filter((row: any) => {
            return Object.values(row).some((val) => val);
          })
          .map((row: any) => {
            // ✅ FULL FORMAT CSV
            if (row.amount || row.note) {
              return {
                amount: Number(row.amount || 0),
                note: row.note || "",
                type: row.type || "expense",
                category: row.category || "Other",
                created_at: row.date || new Date().toISOString(),
              };
            }

            // ✅ SIMPLE CSV FORMAT
            const values = Object.values(row);

            const note = String(values[0] || "");

            const amount = Number(values[1] || 0);

            const aiData = categorizeTransaction(note);

            return {
              note,
              amount,
              type: aiData.type,
              category: aiData.category,
              created_at: new Date().toISOString(),
            };
          });

        await onImport(formattedData);

        alert("CSV Imported Successfully");
      },
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Import / Export
      </h2>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadSampleCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Download Sample CSV
        </button>

        <label className="bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
