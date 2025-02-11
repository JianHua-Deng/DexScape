// ResponsiveDrawer.jsx
import React from 'react';
import { Drawer, IconButton, Divider, List, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavList from '../ui/NavList';
import { useAuth } from '../../lib/AuthContext';

const drawerWidth = 300; // adjust as needed

export default function ResponsiveDrawer({ open, setOpen, isDesktop }) {
  const { session, signOut } = useAuth();

  // Define your navigation links
  const navLinks = [
    {
      text: session ? "Sign out" : "Login",
      path: session ? "/" : "/login",
      onClick: session ? signOut : null,
    },
    { text: "Home", path: "/" },
    { text: "Latest", path: "/latest/1" },
    { text: "Popular", path: "/popular/1" },
  ];

  return (
    <Drawer
      variant={isDesktop ? "persistent" : "temporary"} // persistent on desktop, temporary on mobile
      anchor="left"
      open={open}
      onClose={() => setOpen(false)} // in mobile mode, clicking the backdrop closes the drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Drawer header with a close button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: '2rem' }}>
        <IconButton onClick={() => setOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      {/* Navigation links. On mobile, clicking a link also closes the drawer */}
      <List>
        <NavList
          links={navLinks}
          onItemClick={() => {
            if (!isDesktop) {
              setOpen(false);
            }
          }}
        />
      </List>
    </Drawer>
  );
}
