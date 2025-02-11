// Header.jsx
import React from 'react';
import { useAuth } from "../../lib/AuthContext";
import Searchbar from "../searchbar/Searchbar";
import useHeaderSticky from "../hooks/useHeaderSticky";
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ isDrawerOpen, setIsDrawerOpen, isDesktop }) {
  // useHeaderSticky may return a boolean if you wish to use it;
  // here we force the header to be sticky.
  const isSticky = useHeaderSticky();
  console.log(isSticky);

  return (
    <div
      className={`
        bg-[var(--primary-color)]
        p-8
        ${isSticky ? 'sticky top-0' : 'relative'}
        shadow-[0_1px_5px_var(--box-shadow-color)]
        flex justify-between items-center 
        gap-4 md:gap-0 
        z-[5]
      `}
    >
      <div className="w-[30rem] flex justify-evenly max-[450px]:w-[8rem]">
        {/* Only show the button if its not in desktop mode OR when its not open */}
        {!isDesktop || !isDrawerOpen ? (
          <IconButton onClick={() => setIsDrawerOpen(prev => !prev)} sx={{ color: "inherit" }}>
            <MenuIcon />
          </IconButton>          
        ) : null}

        <Searchbar />
      </div>
    </div>
  );
}

export default Header;
