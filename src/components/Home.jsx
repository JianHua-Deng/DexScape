import { useState } from 'react'
import LatestUploads from './LatestUploads';

//import '../App.css'
import '../styles/Home.css'
import Sidebar from './Sidebar';

function Home() {

  const [queryContent, setQueryContent] = useState("");
  const [mangaData, setMangaData] = useState([]);

  //searchLatestUpload();

  return (
    <>
      <LatestUploads/>
    </>
  )
}

export default Home