// ResponsiveDrawer.jsx
import React from 'react';
import { Drawer, IconButton, Divider, List, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavList from '../ui/NavList';
import { useThemeProvider } from '../../lib/ThemeContextProvider';
import { colors } from '../../utils/colors'
import HomeIcon from '../ui/HomeIcon';
import useWindowWidth from '../hooks/useWindowWidth';

const drawerWidth = 250;

export default function ResponsiveDrawer({ open, setOpen, isDesktop }) {

  const { theme } = useThemeProvider();
  const windowWidth = useWindowWidth();

  const darkModeStyles = {
    paper: {
      backgroundColor: theme === 'dark' ? `${colors.secDarkBg}` : `${colors.darkerLightBg}`,
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
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '.75rem', height: '64px' }}>
        <HomeIcon/>
        <IconButton onClick={() => setOpen(false)}
          sx={{ 
            color: 'inherit', '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor:
                theme === 'dark' ? `${colors.lightHighlight}` : `${colors.darkHighlight}`,
            },
          
          }}
        >
          <CloseIcon 
           
          />
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
