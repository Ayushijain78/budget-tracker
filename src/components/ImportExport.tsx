"use client";

import Papa from "papaparse";
import { categorizeTransaction } from "@/utils/categorizeTransaction";
import { Transaction } from "@/types/transactions.type";
import { useState } from "react";
import toast from "react-hot-toast";
interface Props {
  onImport: (transactions: Transaction[]) => Promise<void>;
}
interface AIResponse {
  type: string;
  category: string;
  date: string;
}

export default function ImportExport({ onImport }: Props) {
  const [previewData, setPreviewData] = useState<any[]>([]);
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
  // function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0];

  //   if (!file) return;

  //   Papa.parse(file, {
  //     header: true,

  //     complete: async (results: any) => {
  //       const formattedData = results.data
  //         .filter((row: any) => {
  //           return Object.values(row).some((val) => val);
  //         })
  //         .map((row: any) => {
  //           // ✅ FULL FORMAT CSV
  //           if (row.amount || row.note) {
  //             return {
  //               amount: Number(row.amount || 0),
  //               note: row.note || "",
  //               type: row.type || "expense",
  //               category: row.category || "Other",
  //               date: row.date || new Date().toISOString(),
  //               created_at: row.date || new Date().toISOString(),
  //             };
  //           }

  //           // ✅ SIMPLE CSV FORMAT
  //           const values = Object.values(row);

  //           const note = String(values[0] || "");

  //           const amount = Number(values[1] || 0);

  //           const aiData: AIResponse = categorizeTransaction(note);

  //           return {
  //             note,
  //             amount,
  //             type: aiData.type,
  //             category: aiData.category,
  //             date: aiData.date || new Date().toISOString(),
  //             created_at: new Date().toISOString(),
  //           };
  //         });

  //       setPreviewData(formattedData);
  //     },
  //   });
  // }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow border dark:border-gray-700 mt-6 w-full">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Import / Export
      </h2>

      {/* Buttons */}
      {/* <div className="flex flex-wrap gap-6 mb-6">
        <button
          onClick={downloadSampleCSV}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl"
        >
          Download Sample CSV
        </button>

        <label className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-xl cursor-pointer">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
      </div> */}

      {/* Preview Table */}
      {previewData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-3 dark:text-white">Import Preview</h3>

          <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-6 text-left">Note</th>

                  <th className="p-6 text-left">Amount</th>

                  <th className="p-6 text-left">Category</th>

                  <th className="p-6 text-left">Type</th>
                </tr>
              </thead>

              <tbody>
                {previewData.map((item, index) => (
                  <tr key={index} className="border-t dark:border-gray-700">
                    <td className="p-6">
                      <input
                        value={item.note}
                        onChange={(e) => {
                          const updated = [...previewData];

                          updated[index].note = e.target.value;

                          setPreviewData(updated);
                        }}
                        className="bg-transparent border rounded px-2 py-1 w-full dark:text-white"
                      />
                    </td>

                    <td className="p-6">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...previewData];

                          updated[index].amount = Number(e.target.value);

                          setPreviewData(updated);
                        }}
                        className="bg-transparent border rounded px-2 py-1 w-full dark:text-white"
                      />
                    </td>

                    <td className="p-6">
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const updated = [...previewData];

                          updated[index].category = e.target.value;

                          setPreviewData(updated);
                        }}
                        className="bg-transparent border rounded px-2 py-1 w-full dark:text-white"
                      >
                        <option value="Food">Food</option>

                        <option value="Travel">Travel</option>

                        <option value="Shopping">Shopping</option>

                        <option value="Bills">Bills</option>

                        <option value="Salary">Salary</option>

                        <option value="Other">Other</option>
                      </select>
                    </td>

                    <td className="p-6">
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...previewData];

                          updated[index].type = e.target.value;

                          setPreviewData(updated);
                        }}
                        className="bg-transparent border rounded px-2 py-1 w-full dark:text-white"
                      >
                        <option value="expense">Expense</option>

                        <option value="income">Income</option>
                      </select>
                    </td>

                    <td className="p-6 dark:text-white whitespace-nowrap">
                      ₹{item.amount}
                    </td>

                    <td className="p-6 dark:text-white whitespace-nowrap">
                      {item.category}
                    </td>

                    <td className="p-6 dark:text-white whitespace-nowrap">
                      {item.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirm Button */}
          <button
            onClick={async () => {
              await onImport(previewData);

              toast.success("Transactions Imported");

              setPreviewData([]);
            }}
            className="bg-black hover:bg-gray-800 transition text-white px-5 py-2 rounded-xl mt-4"
          >
            Confirm Import
          </button>
        </div>
      )}
    </div>
  );
}
