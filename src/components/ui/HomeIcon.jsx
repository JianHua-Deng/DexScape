import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import useWindowWidth from '../hooks/useWindowWidth';
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import { colors } from "../../utils/colors";

export default function HomeIcon({ width }) {

  const windowWidth = useWindowWidth();
  const { theme } = useThemeProvider();

  return (
    <IconButton component={Link} to="/" sx={{
      marginBottom: '5px',
      display: windowWidth <= 490 ? 'none' : 'block',
      color: "inherit",
      borderRadius: '6px',
      '&:focus': { outline: 'none' },
      '&:hover': {
        backgroundColor:
          theme === 'dark' ? `${colors.lightHighlight}` : `${colors.darkHighlight}`,
      },
    }}>
      <img src='/blue-home-icon.png' alt="Home" className='w-24 max-h-full' />
    </IconButton>
  );
}