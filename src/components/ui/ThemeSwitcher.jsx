import { IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeProvider } from "../../lib/ThemeContextProvider";

export default function ThemeSwitcher(){
  const { theme, toggleTheme } = useThemeProvider();

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        '&:focus' : {outline: "none"}
      }}
    >
      {theme === "dark" ? <DarkModeIcon sx={{ color: 'white' }} /> : <LightModeIcon/>}
    </IconButton>
  );
}