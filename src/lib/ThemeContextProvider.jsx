
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {

  const [theme, setTheme] = useState("light");


  const toggleTheme = () => {
    
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  /*
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme])
  */

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      if (localTheme === 'dark'){
        document.documentElement.classList.add("dark");
    }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

  }, []);


  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )

}

export function useThemeProvider() {
  return useContext(ThemeContext);
}