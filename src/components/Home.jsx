import { useState } from 'react'
import SearchResultPage from './SearchResultPage'
import Searchbar from './Searchbar';
//import '../App.css'
import '../styles/Home.css'
import { searchLatestUpload, searchMangas } from '../Utils/APICalls/MangaDexApi';

function Home() {

  const [searchbarContent, setSearchBarcontent] = useState("");
  const [mangaData, setMangaData] = useState([]);

  searchLatestUpload();

  return (
    <>
        <Searchbar value={searchbarContent} 
        fetchResponseFunc={(e) => {
            e.preventDefault();
            searchMangas(searchbarContent).then(resp => {
                setMangaData(resp);
            })
        }}
        onChangeFunc={(e) => {
            setSearchBarcontent(e.target.value);
        }}
        />
        <SearchResultPage mangaData={mangaData}></SearchResultPage>
    </>
  )
}

export default Home