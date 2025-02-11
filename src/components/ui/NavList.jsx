import { List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavList({ links, onItemClick}){
  return (
    <List>
      {links.map((link, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton component={Link} to={link.path} onClick={() => {
            if (link.onClick) link.onClick();
            if (onItemClick) onItemClick();
          }}>
            <ListItemText primary={link.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}