import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchChapterList, searchMangas, searchSpecificManga } from "../../utils/mangaDexApi";
import { getCoverUrl, getAvailableLanguages, getChapterListConfig, filterDuplicateChapters } from "../../utils/utils";
import Tooltip from "../tooltip/Tooltip";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";
import './DetailsPage.css'

function DetailPage(){

    const { mangaID } = useParams();

    const [manga, setManga] = useState({});
    const [coverUrl, setCoverUrl] = useState(''); 
    const [mangaLanguage, setMangaLanguage] = useState([]);
    const [chapterList, setChapterList] = useState([]);
    const [volumeList, setVolumeList] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [tags, setTags] = useState([]);
    
    useEffect(() => {

        setLoadingStatus(true);
        console.log("Fetching Manga Data");
        searchSpecificManga(mangaID).then(resp => {
            setManga(resp);
            setCoverUrl(getCoverUrl(resp));
            setMangaLanguage(getAvailableLanguages(resp));
        })
    }, []);
    
    useEffect(() => {

        // Return if manga or mangaLanguage is empty
        if (!manga?.attributes || !mangaLanguage?.length) return;

        const paramConfig = getChapterListConfig(mangaLanguage);
    
        setTags(() => {
            return manga.attributes.tags.filter(tag => tag.attributes.group === 'genre') ?? [];
        });

        fetchChapterList(mangaID, paramConfig).then(respond =>{
            const filteredChapter = filterDuplicateChapters(respond);
            setChapterList(filteredChapter);
        }).finally(() => {
            setLoadingStatus(false);
        });


    }, [manga, mangaLanguage]);

    
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
                            <img className="manga-cover-img" src={coverUrl} alt="manga-cover"/>
                            <div className="details">
                                <h1 className="manga-title">
                                    { manga?.attributes?.title?.en || (manga?.attributes?.title['ja-ro'] && Object.values(manga.attributes.title)[0]) || 'Title Not Available'}
                                </h1>
                                <div className="manga-descriptions">
                                    <p>{`${manga?.attributes?.description?.en || 'N/A'}`}</p>
                                </div>
                                {tags.length < 1 ? (
                                    <></>
                                ) : (
                                    <div className="tags-container">
                                        {tags.map((tag, index) => (
                                            <Link className="tag" target="_blank" rel="noopener noreferrer" key={tag.id} id={`tag-${index}`} to={{pathname: `/tag/${tag.attributes.name.en}/${tag.id}/1`}}>
                                                {`${tag.attributes.name.en}`}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                
                            </div>
                            <Link className='start-reading-button'
                                rel="noopener noreferrer"
                                to={{
                                    pathname: chapterList.length > 0 ? `/comic/${mangaID}/chapter/${chapterList[0].id}/1` : `/comic/${mangaID}`,
                                }}>
                                Start Reading
                            </Link>
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
                                                    <Tooltip key={index} content={chapter.attributes.title} direction="top">
                                                        <Link className="chapter" id={chapter.id} to={`/comic/${mangaID}/chapter/${chapter.id}/1`}>
                                                            <p className="chapter-container">
                                                                <span className="chapter-number">
                                                                    {`${chapter.attributes.chapter || 'Oneshot'}`}
                                                                </span>
                                                                {/*
                                                                If I ever want to display the chapter title
                                                                <span className="chapter-title">
                                                                    {chapter.attributes.title ? `- ${chapter.attributes.title}` : ''}
                                                                </span>                                                                
                                                                */}
                                                            </p>
                                                        </Link>
                                                    </Tooltip>
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