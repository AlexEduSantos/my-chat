"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { ContrastIcon } from "lucide-react";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} variant="ghost" className="">
        <ContrastIcon />
        <p>Alterar tema</p>
      </Button>
    </div>
  );
}

export default ThemeSwitcher;
