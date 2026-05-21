"use client";

import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("theme");

    if (storedTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      );

      setDarkMode(true);
    }
  }, []);

  function toggleDarkMode() {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");

      localStorage.setItem("theme", "light");

      setDarkMode(false);
    } else {
      html.classList.add("dark");

      localStorage.setItem("theme", "dark");

      setDarkMode(true);
    }
  }

  return {
    darkMode,
    toggleDarkMode,
  };
}