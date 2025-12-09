"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder to prevent hydration mismatch
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-primary-foreground"
        disabled
      >
        <Moon className="h-5 w-5 sm:h-5 sm:w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 transition-all"
      title={theme === "light" ? "ប្ដូរទៅរបៀបងងឹត" : "ប្ដូរទៅរបៀបស្វាយ"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 sm:h-5 sm:w-5" />
      ) : (
        <Sun className="h-5 w-5 sm:h-5 sm:w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

