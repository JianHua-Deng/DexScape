import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../Utils/APICalls/MangaDexApi";
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
            
            {mangaData.length > 0 ? 
            mangaData.map((manga, index) => {
                return (
                    <div className="manga-item" key={`${index}`}>
                        <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.256.jpg`} alt="" /> 
                        <p>{`${manga.attributes.title.en}`}</p>
                    </div>
                )
            }):
               <p>No results</p>
            }
            
        </div>
    );
}


export default SearchResultPage;