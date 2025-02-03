import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'
import { useEffect, useState } from 'react'
import Home from './components/home/Home'
import Header from './components/header/Header'
import SearchResultPage from './components/search-result/SearchResultPage'
import DetailPage from './components/details-page/DetailsPage'
import AuthProvider from './lib/AuthContext'
import './App.css'
import Reader from './components/reader/Reader'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'



function App() {

  return (

    <AuthProvider>
      <SkeletonTheme baseColor="#c4c4c4" highlightColor="#e6e6e6">
        <BrowserRouter>
        <Header/>
        <div className='main-contents'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="signup" element={<Signup/>}/>
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
    </AuthProvider>
  )
}

export default App
