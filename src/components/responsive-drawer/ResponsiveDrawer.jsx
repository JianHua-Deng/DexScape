// ResponsiveDrawer.jsx
import React from 'react';
import { Drawer, IconButton, Divider, List, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavList from '../ui/NavList';
import { useThemeProvider } from '../../lib/ThemeContextProvider';
import { colors } from '../../utils/colors'

const drawerWidth = 250;

export default function ResponsiveDrawer({ open, setOpen, isDesktop }) {

  const { theme } = useThemeProvider();

  const darkModeStyles = {
    paper: {
      backgroundColor: theme === 'dark' ? `${colors.secDarkBg}` : `${colors.lightBg}`,
      color: theme === 'dark' ? `${colors.lightText}` : `${colors.darkText}`,
    },
    divider: {
      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
    },
    iconButton: {
      color: theme === 'dark' ? `${colors.lightText}` : `${colors.darkText}`,
    }
  };

  return (
    <Drawer
      variant={isDesktop ? "persistent" : "temporary"} // persistent on desktop, temporary on mobile
      anchor="left"
      open={open}
      onClose={() => setOpen(false)} // in mobile mode, clicking the backdrop closes the drawer
      className={`${darkModeStyles.backgroundColor}`}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          ...darkModeStyles.paper,
          backgroundImage: 'none',
        }

      }}
    >
      
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
