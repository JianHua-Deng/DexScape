import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { fetchChapterList, searchMangas, searchSpecificManga } from "../../Utils/APICalls/MangaDexApi";
import { getChapterMetaData } from "../../Utils/APICalls/MangaDexApi";
import { getCoverUrl, getAvailableLanguages } from "../../Utils/Utils";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";
import './DetailsPage.css'
import Skeleton from "react-loading-skeleton";

function DetailPage(){

    const navigate = useNavigate();
    const location = useLocation();
    const {mangaID} = useParams();

    const [manga, setManga] = useState(location.state || null);
    const [coverUrl, setCoverUrl] = useState(location.state ? getCoverUrl(location.state) : ''); // if location.state is a valid manga object, get url right away
    const [mangaLanguage, setMangaLanguage] = useState(location.state ? getAvailableLanguages(location.state) : '');// if location.state is a valid manga object, get available language right away
    const [chapterList, setChapterList] = useState([]);
    const [volumeList, setVolumeList] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [tags, setTags] = useState([]);

    const mangaPrint = JSON.stringify(manga);
    
    //console.log(mangaPrint + "\n" + "Languages: " + mangaLanguage);
    //console.log(manga);
    //console.log(tags);
    
    useEffect(() => {
        //Fetch manga data if not available in location.state, this would usually happen after user refresh the page
        if(!manga){

            searchSpecificManga(mangaID).then(resp => {
                setManga(resp);
                setCoverUrl(getCoverUrl(resp));
                console.log("Url: " + getCoverUrl(resp));
                setMangaLanguage(getAvailableLanguages(resp));
                console.log("Language: " + getAvailableLanguages(resp));
            })
        }
    }, [])
    
    useEffect(() => {

        if(manga && mangaLanguage){
            setLoadingStatus(true);

            const paramConfig = {
                limit: 500,
                translatedLanguage: mangaLanguage,
                includeExternalUrl: 0,
                order: {
                    chapter: 'asc',
                }
            }
        
            setTags(() => {
                return manga.attributes.tags.filter(tag => tag.attributes.group === 'genre');
            });
    
            fetchChapterList(mangaID, paramConfig).then(respond =>{
                setChapterList(respond);
            }).finally(() => {
                setLoadingStatus(false);
            });
        }

    }, [manga]);

    
    //Sorting and grouping chapters based on the volume they belong to
    useEffect(() => {
        setVolumeList(() => {
            return chapterList.reduce((acc, chapter) => {
                const volume = chapter.attributes.volume;
                if(!volume){ //Check if the volume attribute of this chapter is null
                    //if Uncategorized was never initialized
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

    return (
        <>
            <div className="manga-details-container">

                {loadingStatus ? (
                    <DetailsSkeleton/>
                ):(
                    <>
                        <div className="details-container">
                            <img className="manga-cover-img" src={`${coverUrl}`} alt="manga-cover"/>
                            <div className="details">
                                <h1 className="manga-title">
                                    {manga?.attributes?.title?.en ? manga?.attributes?.title?.en : manga?.attributes?.title['ja-ro'] || Object.values(manga.attributes.title)[0]}
                                </h1>
                                <div className="manga-descriptions">
                                    <p>{`${manga?.attributes?.description?.en || 'N/A'}`}</p>
                                </div>
                                {tags.length < 1 ? (
                                    <></>
                                ) : (
                                    <div className="tags-container">
                                        {tags.map((tag, index) => (
                                            <div className="tag" key={tag.id} id={`tag-${index}`} onClick={() => {
                                                navigate(`/tag/${tag.attributes.name.en}/${tag.id}/1`);
                                            }}>
                                                {`${tag.attributes.name.en}`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                            </div>
                            <button className='start-reading-button' onClick={() => {
                                if (chapterList.length > 0) {
                                    navigate(`/chapter/${chapterList[0].id}`, { state: manga });
                                }
                            }}>Start Reading</button>
                        </div>                    
                        {chapterList.length < 1 ? (
                            <p>No Chapter is Available</p>
                        ) : (
                            <div className="data-container">
                                <div className="chapter-list">
                                    {Object.entries(volumeList).map(([volume, chapters], index) => (
                                        <div className="volume-chapter-container" key={index}>
                                            <div className="volume-chapter-title">
                                                {volume === "Uncategorized" ? (<h2>Chapters</h2>) : (<h2>{`Volume ${volume}`}</h2>)}
                                            </div>
                                            <div className="chapters-container">
                                                {chapters.map((chapter, index) => (
                                                    <div className="chapter" key={index} id={chapter.id} onClick={() => {
                                                        navigate(`/chapter/${chapter.id}`, { state: manga });
                                                    }}>
                                                        <p className="chapter-container">
                                                            <span className="chapter-number">
                                                                {`${chapter.attributes.chapter || 'Oneshot'}`}
                                                            </span>
                                                            <span className="chapter-title">
                                                                {chapter.attributes.title ? `- ${chapter.attributes.title}` : ''}
                                                            </span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </>
    );
}

export default DetailPage;