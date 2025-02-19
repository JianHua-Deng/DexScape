// Header.jsx
import React from 'react';
import Searchbar from "../searchbar/Searchbar";
import useHeaderSticky from "../hooks/useHeaderSticky";
import { IconButton } from '@mui/material';
import HomeIcon from "../ui/HomeIcon";
import MenuIcon from '@mui/icons-material/Menu';
import { useThemeProvider } from '../../lib/ThemeContextProvider';
import { colors } from '../../utils/colors';

function Header({ isDrawerOpen, setIsDrawerOpen, isDesktop }) {

  const isSticky = useHeaderSticky();
  const { theme } = useThemeProvider();

  return (
    <div
      className={`
        bg-lightBg dark:bg-darkBg
        p-4
        h-16
        max-h-16
        ${isSticky ? 'sticky top-0' : 'relative'}
        shadow-md
        flex justify-between items-center 
        gap-4 md:gap-0 
        z-[5]
      `}
    >
        {/* Only show the button if its not in desktop mode OR when its not open */}
        <div className='flex items-center gap-1 h-full'>
          {!isDesktop || !isDrawerOpen ? (
            <>
              <IconButton onClick={() => setIsDrawerOpen(prev => !prev)}
                sx={{ 
                  height: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  color: "inherit",
                  '&:hover': {
                    backgroundColor:
                      theme === 'dark' ? `${colors.lightHighlight}` : `${colors.darkHighlight}`,
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                <MenuIcon className="dark:text-white" />
              </IconButton>
              <HomeIcon/>
            </>
          ) : null}
        </div>

        <Searchbar />
    </div>
  );
}

export default Header;
