"use client";

import { supabase } from "@/lib/supabase";
import useDarkMode from "@/hooks/useDarkMode";

interface Props {
  email?: string;
}

export default function Header({ email }: Props) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-500 border dark:border-gray-700 rounded-2xl px-6 py-4 shadow mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Budget Tracker</h1>

          <p className="text-sm text-gray-500 dark:text-gray-300  mt-1">
            Track your expenses smartly
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-300 ">
              Logged in as
            </p>

            <p className="font-medium">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Logout
          </button>
          <a
            href="/analytics"
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Analytics
          </a>
          <button
            onClick={toggleDarkMode}
            className="text-gray-500 border dark:border-gray-700 px-4 py-2 rounded-xl"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          
        </div>
      </div>
    </div>
  );
}
