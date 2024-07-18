import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import Header from './components/Header'
import SearchResultPage from './components/SearchResultPage'
import './App.css'
import Sidebar from './components/Sidebar'

function App() {


  return (
    <>
      <BrowserRouter>
      <Header/>
      <Sidebar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="search/:queryString" element={<SearchResultPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
