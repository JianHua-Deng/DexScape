
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
    }
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");   
    }

  }, []);

  const context = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={context}>
      {children}
    </ThemeContext.Provider>
  )

}

export function useThemeProvider() {
  return useContext(ThemeContext);
}