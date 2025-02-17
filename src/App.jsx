// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Toaster } from 'react-hot-toast';
import { useTheme, useMediaQuery, Box } from '@mui/material';

import Home from './components/home/Home';
import Header from './components/header/Header';
import SearchResultPage from './components/search-result/SearchResultPage';
import DetailPage from './components/details-page/DetailsPage';
import Reader from './components/reader/Reader';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import ResponsiveDrawer from './components/responsive-drawer/ResponsiveDrawer';
import { useThemeProvider } from './lib/ThemeContextProvider';
import { colors } from './utils/colors';

function App() {
  const muiTheme = useTheme();
  const { theme } = useThemeProvider();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 250;

  return (

    <SkeletonTheme baseColor="#c4c4c4" highlightColor="#e6e6e6">
      <BrowserRouter>
        <Toaster position="top-center" />
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: theme === 'dark' ? colors.darkBg : colors.lightBg,
          }}
        >
          <ResponsiveDrawer open={drawerOpen} setOpen={setDrawerOpen} isDesktop={isDesktop} />

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              marginLeft: isDesktop && drawerOpen ? `${drawerWidth}px` : 0,
              transition: muiTheme.transitions.create('margin', {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.leavingScreen,
              }),
              height: '100%',
              position: 'relative'
            }}
          >

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch', // Enables smooth scrolling on iOS
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Header isDrawerOpen={drawerOpen} setIsDrawerOpen={setDrawerOpen} isDesktop={isDesktop} />
              
              <Box
                sx={{
                  flex: 1,
                }}
                className="main-content bg-lightBg dark:bg-darkBg shadow-md flex flex-col max-w-[100vw]"
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="popular/:page" element={<SearchResultPage />} />
                  <Route path="latest/:page" element={<SearchResultPage />} />
                  <Route path="tag/:name/:uuid/:page" element={<SearchResultPage />} />
                  <Route path="search/:queryString/:page" element={<SearchResultPage />} />
                  <Route path="comic/:mangaID/chapter/:chapterID/:page" element={<Reader />} />
                  <Route path="comic/:mangaID" element={<DetailPage />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </SkeletonTheme>

  );
}

export default App;
