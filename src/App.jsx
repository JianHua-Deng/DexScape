// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Toaster } from 'react-hot-toast';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { Analytics } from "@vercel/analytics/react"

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
import History from './components/history/History';
import Favorites from './components/favorites/Favorites';
import { checkMangadexHealth } from './utils/mangaDexApi';

function App() {
  const muiTheme = useTheme();
  const { theme } = useThemeProvider();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMangadexHealthy, setIsMangadexHealthy] = useState(true);
  const drawerWidth = 250;

  useEffect(() => {
    async function checkHealth() {
      try {
        const health = await checkMangadexHealth();
        setIsMangadexHealthy(health);
      } catch (error) {
        console.error("Error checking health", error);
      }
    }

    checkHealth();
  }, [])

  return (
    isMangadexHealthy ? (
      <SkeletonTheme baseColor={ theme === 'dark' ? "#5c5c5c" : "#c4c4c4" } highlightColor="#e6e6e6">
        <Analytics />
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
                className="main-scroll-container"
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
                    <Route path="acclaimed/:page" element={<SearchResultPage />} />
                    <Route path="trend/:page" element={<SearchResultPage/>} />
                    <Route path="latest/:page" element={<SearchResultPage />} />
                    <Route path="tag/:name/:uuid/:page" element={<SearchResultPage />} />
                    <Route path="search/:queryString/:page" element={<SearchResultPage />} />
                    <Route path="comic/:mangaID/chapter/:chapterID/:page" element={<Reader />} />
                    <Route path="comic/:mangaID" element={<DetailPage />} />
                    <Route path='history/:page' element={<History/>} />
                    <Route path='favorites/:page' element={<Favorites/>} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          </Box>
        </BrowserRouter>
      </SkeletonTheme>
    ) : (

      <div className={`w-screen h-screen flex justify-center items-center dark:bg-darkBg bg-lightBg`}>
        <div className='max-w-[20rem] h-auto flex flex-col items-center gap-5'>
          <img className="w-40 h-auto rounded-md" src="/bocchi-on-the-rocks.gif"/>
          <h2 className='text-darkText dark:text-lightText text-center'>
            Unfortunately, The Mangadex server seems to be down right now...
          </h2>
        </div>
      </div>
      
    )

  );
}

export default App;
