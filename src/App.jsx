import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import SearchResultPage from './components/SearchResultPage'
import './App.css'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
