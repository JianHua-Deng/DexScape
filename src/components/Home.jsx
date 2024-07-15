import { useState } from 'react'
import SearchResultPage from './SearchResultPage'
import Searchbar from './Searchbar';
import '../App.css'
import { searchMangas } from '../Utils/APICalls/MangaDexApi';

function Home() {

  const [searchbarContent, setSearchBarcontent] = useState("");
  const [mangaData, setMangaData] = useState([]);

  return (
    <>
        <nav className="navbar">
            <li className="home"></li>
            <li className="">#</li>
            <li className="">#</li>
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
        </nav>
        <SearchResultPage mangaData={mangaData}></SearchResultPage>
    </>
  )
}

export default Home