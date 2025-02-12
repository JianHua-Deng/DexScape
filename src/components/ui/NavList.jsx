import { List, ListItem, ListItemButton, ListItemText, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";


export default function NavList({ onItemClick }){

  const {session, signOut} = useAuth();

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
          <ListItemButton component={Link} to={link.path} onClick={() => {
            if (link.onClick) link.onClick();
            // OnItemClick is to close the drawer when user is on mobile device
            if (onItemClick) onItemClick();
          }}>
            <ListItemText primary={link.text} />
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
    </Box>
  );
}