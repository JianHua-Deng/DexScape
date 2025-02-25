import { List, ListItem, ListItemButton, ListItemText, Box, Divider, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import { useThemeProvider } from "../../lib/ThemeContextProvider";

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';

import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { colors } from "../../utils/colors";


export default function NavList({ onItemClick }){

  const { session, signOut } = useAuth();
  const { theme } = useThemeProvider();

  const authNavLinks = [
    { text: "Login", path: "/login", component: <LoginIcon/> },
  ]

  const profileNavLinks = [
    //{text: "Profile", path: "/profile", component: <AccountCircleIcon/>},
    {text: "Favorites", path: "/favorites/1", component: <FavoriteIcon/>},
    {text: "History", path: "/history/1", component: <HistoryIcon/>},
    {text: "Sign out", path: "/", onClick: signOut, component: <LogoutIcon/>},
  ]

  const navLinks = [
    { text: "Home", path: "/", component: <HomeIcon/> },
    { text: "Popular", path: "/popular/1", component: <WhatshotIcon/>},
    { text: "Latest", path: "/latest/1", component: <FiberNewIcon/>},
  ];

  function mapNavitems(navList) {
    return (
      <List>
      {navList.map((link, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton component={Link} to={link.path} 
            onClick={() => {
              if (link.onClick) link.onClick();
              // OnItemClick is to close the drawer when user is on mobile device
              if (onItemClick) onItemClick();
            }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor:
                  theme === 'dark' ? colors.lightHighlight : colors.darkHighlight,
              },
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '8rem'
            }}>
              {link.component ? (link.component) : (null)}
  
              <ListItemText 
                sx={{display: 'flex', justifyContent: 'center', alignContent: 'center' , width: '100%', gap: 0}} 
                primary={link.text} 
              />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    )
  }

  return (
    <Box>
      {session ? mapNavitems(profileNavLinks) : mapNavitems(authNavLinks)}
      <Divider/>
      {mapNavitems(navLinks)}

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <ThemeSwitcher/>
      </Box>
    </Box>
  );
}