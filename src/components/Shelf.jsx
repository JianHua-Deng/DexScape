import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../Utils/APICalls/MangaDexApi";

let src = "";

function Shelf({title}) {

    const [mangaData, setMangaData] = useState([]);

    useEffect(() =>{
        searchMangas(title).then((resp) =>{
            setMangaData(resp);
            console.log(resp);
        });

    }, []);

    /*
    useEffect(() => {
        if(mangaData.length > 0){
            src = `https://uploads.mangadex.org/covers/${mangaData[0].id}/${mangaData[0].relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}`;
        }
    }, [mangaData]);
    */
    return(
        <div className="shelf-container">
            
            {mangaData.length > 0 ? 
            mangaData.map((manga, index) => {
                return (
                    <div className="manga" key={`${index}`}>
                        <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}`} alt="" /> 
                    </div>
                )
            }):
               <p>No results</p>
            }
            
        </div>
    );
}


export default Shelf;