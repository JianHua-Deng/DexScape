import { List, ListItem, ListItemButton, ListItemText, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import { useThemeProvider } from "../../lib/ThemeContextProvider";


export default function NavList({ onItemClick }){

  const {session, signOut} = useAuth();
  const { theme } = useThemeProvider();

  const authNavLinks = [
    {
      text: session ? "Sign out" : "Login",
      path: session ? "/" : "/login",
      onClick: session ? signOut : null,
    },
  ]

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Latest", path: "/latest/1" },
    { text: "Popular", path: "/popular/1" },
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
              '&:hover': {
                backgroundColor:
                  theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <ListItemText 
              sx={{display: 'flex', justifyContent: 'center', alignContent: 'center' , width: '100%' ,gap: 0}} 
              primary={link.text} 
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    )
  }

  return (
    <Box>
      {mapNavitems(authNavLinks)}
      <Divider/>
      {mapNavitems(navLinks)}

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <ThemeSwitcher/>
      </Box>
    </Box>
  );
}