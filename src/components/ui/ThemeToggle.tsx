"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-sm border rounded-lg px-3 py-1"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
