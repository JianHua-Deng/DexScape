// ResponsiveDrawer.jsx
import React from 'react';
import { Drawer, IconButton, Divider, List, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavList from '../ui/NavList';

const drawerWidth = 300;

export default function ResponsiveDrawer({ open, setOpen, isDesktop }) {

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
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      {/* Drawer header with a close button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: '.75rem' }}>
        <IconButton onClick={() => setOpen(false)}
          sx={{ color: 'inherit', '&:focus': { outline: 'none' } }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      {/* Navigation links. On mobile, clicking a link also closes the drawer */}
      <List>
        <NavList
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
