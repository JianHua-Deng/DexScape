import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/home/Home'
import Header from './components/header/Header'
import SearchResultPage from './components/search-result/SearchResultPage'
import DetailPage from './components/details-page/DetailsPage'
import './App.css'  
import Reader from './components/reader/Reader'

function App() {


  return (
    <>
      <BrowserRouter>
      <Header/>
      <div className='main-contents'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="search/:queryString/" element={<SearchResultPage/>}/>
          <Route path="chapter/:chapterID" element={<Reader/>}/>
          <Route path="manga/:mangaID" element={<DetailPage/>}/>
        </Routes>
      </div>
      </BrowserRouter>
    </>
  )
}

export default App
