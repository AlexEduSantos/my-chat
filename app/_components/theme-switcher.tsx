"use client";

import { useTheme } from "next-themes";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Alternar tema
      </button>
    </div>
  );
}

export default ThemeSwitcher;
