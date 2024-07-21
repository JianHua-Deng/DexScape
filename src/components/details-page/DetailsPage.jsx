import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchChapterList } from "../../Utils/APICalls/MangaDexApi";

function DetailPage(){

    const location = useLocation();
    const manga = location.state;

    const [chapterList, setChapterList] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        fetchChapterList(manga.id, ['en']).then(respond =>{
            setLoadingStatus(true);
            setChapterList(respond);
        }).finally(() => {setLoadingStatus(false)});
    }, []);


    return (
        <>
            <div className="manga-details-container">
                <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`}/>
                <p>{`Descriptions: ${manga.attributes.description.en}`}</p>
                {loadingStatus && chapterList.length === 0 ? (
                    <p>Loading</p>
                ):(
                    <div className="chapters-container">
                        {chapterList.map((chapter, index) => {
                            return (
                                <div className="chapter" key={index} id={chapter.id}>
                                    <p>{chapter.attributes.chapter}</p>
                                    <p>{chapter.attributes.title}</p>
                                </div>
                            );
                        })}
                    </div>
                    )
                }

            </div>
        </>
    );
}

export default DetailPage;