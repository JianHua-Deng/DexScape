import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import Home from './components/home/Home'
import Header from './components/header/Header'
import SearchResultPage from './components/search-result/SearchResultPage'
import DetailPage from './components/details-page/DetailsPage'
import './App.css'
import Reader from './components/reader/Reader'



function App() {

  return (
    <>
      <SkeletonTheme baseColor="#c4c4c4" highlightColor="#e6e6e6">
        <BrowserRouter>
        <Header/>
        <div className='main-contents'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="popular/:page" element={<SearchResultPage/>}/>
            <Route path="latest/:page" element={<SearchResultPage/>}/>
            <Route path="tag/:name/:uuid/:page" element={<SearchResultPage/>}/>
            <Route path="search/:queryString/:page" element={<SearchResultPage/>}/>
            <Route path="comic/:mangaID/chapter/:chapterID" element={<Reader/>}/>
            <Route path="comic/:mangaID" element={<DetailPage/>}/>
          </Routes>
        </div>
        </BrowserRouter>
      </SkeletonTheme>
    </>
  )
}

export default App
