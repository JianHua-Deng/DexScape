import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchChapterList } from "../../Utils/APICalls/MangaDexApi";
import { getChapterMetaData } from "../../Utils/APICalls/MangaDexApi";
import { getCoverUrl } from "../../Utils/Utils";
import './DetailsPage.css'

function DetailPage(){

    const location = useLocation();
    const manga = location.state;

    const [chapterList, setChapterList] = useState([]);
    const [volumeList, setVolumeList] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    
    const coverUrl = getCoverUrl(manga);

    useEffect(() => {
        fetchChapterList(manga.id, ['en']).then(respond =>{
            setLoadingStatus(true);
            setChapterList(respond);
        }).finally(() => {
            setLoadingStatus(false);
        });
    }, []);

    useEffect(() => {
        //console.log(volumeList);
        console.log(Object.entries(volumeList))
    },[volumeList])

    useEffect(() => {
        setVolumeList(() => {
            return chapterList.reduce((acc, chapter) => {
                const volume = chapter.attributes.volume;
                if(!volume){ //Check if the volume attribute of this chapter is null
                    if(!acc['Uncategorized']){
                        acc['Uncategorized'] = [];
                    }
                    acc['Uncategorized'].push(chapter);
                    return acc;
                }
                if(!acc[volume]){ //if this volume group does not exist
                    acc[volume] = [];
                }
                acc[volume].push(chapter);
                return acc;
            }, {});
        })

    }, [chapterList]);

    function chapterOnClick(e){
        const id = e.id;
    }


    return (
        <>
            <div className="manga-details-container">
                <div className="details-container">
                    <img className="manga-cover-img" src={`${coverUrl}`}/>
                    <h1 className="manga-title">{manga.attributes.title.en}</h1>
                    <div className="manga-descriptions">
                        <p>{`Descriptions: ${manga.attributes.description.en}`}</p>
                    </div>
                </div>
                {loadingStatus && volumeList.length === 0 ? (
                    <p>Loading</p>
                ):(
                    <div className="chapters-container">
                        <div className="chapter-list">
                            {Object.entries(volumeList).map(([volume, chapters], index) => {
                                return (
                                    <div className="volume-chapter-container" key={index}>
                                        <div className="volume-chapter-title">
                                            {volume === "Uncategorized" ? (<h2>Chapters</h2>):(<h2>{`Volume ${volume}`}</h2>)}
                                        </div>

                                        <div className="chapters-container">
                                            {chapters.map((chapter, index) => {
                                                return (
                                                    <div className="chapter" key={index} id={chapter.id} onClick={() => {getChapterMetaData(chapter.id)}}>
                                                        <p className="chapter-number chapter-title">
                                                            {`${chapter.attributes.chapter}${chapter.attributes.title ? ` - ${chapter.attributes.title}` : ''}`}
                                                        </p>
                                                    </div>
                                                );                                        
                                            })}
                                        </div>

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