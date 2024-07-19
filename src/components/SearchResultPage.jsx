import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../Utils/APICalls/MangaDexApi";
import MangaPreview from "./MangaPreview";
import '../styles/SearchResultPage.css';
import { useParams } from "react-router-dom";

function SearchResultPage() {

    const {queryString} = useParams();
    const [mangaData, setMangaData] = useState([]);

    
    useEffect(() =>{
        searchMangas(queryString).then((resp) =>{
            setMangaData(resp);
            console.log(resp);
        });

    }, [queryString]);
    

    return(
        <div className="search-result-container">
            
            {mangaData.length > 0 ? (
            mangaData.map((manga, index) => {
                return (
                    <MangaPreview manga={manga} index={index}/>
                )
            })):(
               <p>No results</p>
                )
            }
            
        </div>
    );
}


export default SearchResultPage;