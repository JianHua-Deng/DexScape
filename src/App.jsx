import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SkeletonTheme } from 'react-loading-skeleton'
import Home from './components/home/Home'
import Header from './components/header/Header'
import SearchResultPage from './components/search-result/SearchResultPage'
import DetailPage from './components/details-page/DetailsPage'
import AuthProvider from './lib/AuthContext'
import './App.css'
import Reader from './components/reader/Reader'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import { Toaster } from 'react-hot-toast'



function App() {

  return (


    <AuthProvider>
      <SkeletonTheme baseColor="#c4c4c4" highlightColor="#e6e6e6">
        <BrowserRouter>
        <Toaster position='top-center'/>
        <div className="
        grid grid-rows-[auto_1fr] grid-cols-[1fr_7fr_1fr] 
        gap-4 h-auto w-screen
        
        "
        >
        <Header/>
          <div
            className="
              p-12 mb-12 rounded-[2rem] bg-[var(--primary-color)]
              shadow-[0_1px_5px_var(--box-shadow-color)]
              col-start-1 col-end-4
              w-full flex flex-col
              md:col-start-2 md:col-end-3 md:w-[80vw]
            "
          >
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="signup" element={<Signup/>}/>
              <Route path="popular/:page" element={<SearchResultPage/>}/>
              <Route path="latest/:page" element={<SearchResultPage/>}/>
              <Route path="tag/:name/:uuid/:page" element={<SearchResultPage/>}/>
              <Route path="search/:queryString/:page" element={<SearchResultPage/>}/>
              <Route path="comic/:mangaID/chapter/:chapterID/:page" element={<Reader/>}/>
              <Route path="comic/:mangaID" element={<DetailPage/>}/>
            </Routes>
          </div>
        </div>
        </BrowserRouter>
        
      </SkeletonTheme>
    </AuthProvider>
  )
}

export default App
