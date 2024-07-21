import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchChapterList } from "../../Utils/APICalls/MangaDexApi";
import './DetailsPage.css'

function DetailPage(){

    const location = useLocation();
    const manga = location.state;

    const [chapterList, setChapterList] = useState([]);
    const [volumeList, setVolumeList] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        fetchChapterList(manga.id, ['en']).then(respond =>{
            setLoadingStatus(true);
            setChapterList(respond);
        }).finally(() => {
            setLoadingStatus(false);
        });
    }, []);

    useEffect(() => {
        console.log(volumeList);
    },[volumeList])

    useEffect(() => {
        setVolumeList(() => {
            return chapterList.reduce((acc, chapter) => {
                const volume = chapter.attributes.volume;
                if(!volume){ //Check if the volume attribute of this chapter is null
                    if(!acc['No Volume']){
                        acc['No Volume'] = [];
                    }
                    acc['No Volume'].push(chapter);
                    return acc;
                }
                if(!acc[volume]){ //if this volume group does not exist
                    acc[volume] = [];
                }
                acc[volume].push(chapter);
                return acc;
            }, {});
        })
    }, [chapterList])


    return (
        <>
            <div className="manga-details-container">
                <div className="details-container">
                    <img className="manga-cover-img" src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`}/>
                    <h1 className="manga-title">{manga.attributes.title.en}</h1>
                    <p>{`Descriptions: ${manga.attributes.description.en}`}</p>
                </div>
                {loadingStatus && chapterList.length === 0 ? (
                    <p>Loading</p>
                ):(
                    <div className="chapters-container">
                        <h2>Chapters</h2>
                        <div className="chapter-list">
                            {chapterList.map((chapter, index) => {
                                return (
                                    <div className="chapter" key={index} id={chapter.id}>
                                        <p>{chapter.attributes.chapter}</p>
                                        <p>{chapter.attributes.title}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    )
                }

            </div>
        </>
    );
}

export default DetailPage;