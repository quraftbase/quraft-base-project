// context/ThemeContext.tsx

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "futuristic" | "dragonball";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void; // ← これを追加
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dragonball",
  toggleTheme: () => {},
  setTheme: () => {}, // ← これも追加
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dragonball");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "futuristic" ? "dragonball" : "futuristic"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
