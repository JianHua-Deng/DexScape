import { useState } from 'react'
import SearchResultPage from './SearchResultPage'
import Searchbar from './Searchbar';
//import '../App.css'
import '../styles/Home.css'
import { searchLatestUpload, searchMangas } from '../Utils/APICalls/MangaDexApi';
import Sidebar from './Sidebar';

function Home() {

  const [queryContent, setQueryContent] = useState("");
  const [mangaData, setMangaData] = useState([]);

  searchLatestUpload();

  return (
    <>

    </>
  )
}

export default Home