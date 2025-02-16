// Header.jsx
import React from 'react';
import Searchbar from "../searchbar/Searchbar";
import useHeaderSticky from "../hooks/useHeaderSticky";
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ isDrawerOpen, setIsDrawerOpen, isDesktop }) {
  // useHeaderSticky may return a boolean if you wish to use it;
  // here we force the header to be sticky.
  const isSticky = useHeaderSticky();

  return (
    <div
      className={`
        bg-white
        p-3
        ${isSticky ? 'sticky top-0' : 'relative'}
        shadow-md
        flex justify-between items-center 
        gap-4 md:gap-0 
        z-[5]
      `}
    >
        {/* Only show the button if its not in desktop mode OR when its not open */}
        <div>
          {!isDesktop || !isDrawerOpen ? (
            <IconButton onClick={() => setIsDrawerOpen(prev => !prev)} 
              sx={{ 
                color: "inherit",
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <MenuIcon />
            </IconButton>          
          ) : null}
        </div>

        <Searchbar />
    </div>
  );
}

export default Header;
