import './Reader.css'

import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams} from "react-router-dom";
import { getChapterMetaData, searchSpecificManga, fetchChapterList } from '../../Utils/APICalls/MangaDexApi';
import Skeleton from 'react-loading-skeleton'
import { getChapterListConfig, getAvailableLanguages } from '../../Utils/Utils';
import Select from 'react-select';

function Reader(){

    const navigate = useNavigate();

    const {mangaID} = useParams();
    const { chapterID } = useParams();

    const [manga, setManga] = useState({});
    const [chapterList, setChapterList] = useState([]);
    const [mangaLanguage, setMangaLanguage] = useState([]);
    const [selectorOptions, setSelectorOptions] = useState([]);
    const [metaData, setMetaData] = useState(null);
    const [imageUrlArray, setImageUrlArray] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [imgURL, setImageURL] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    //fetching Manga, then chapterlist of the manga, then set the selector options based on the chapterlist, then lastly, fetch the metadata according to current chapterID
    useEffect(() => {
        setIsLoadingData(true);
        setIsImageLoading(true);
    
        searchSpecificManga(mangaID).then(respond => {
            setManga(respond);
            setMangaLanguage(getAvailableLanguages(respond));
        });

    }, [chapterID]);

    useEffect(() => {
        getChapterMetaData(chapterID).then(respond => {
            setMetaData(respond);
        });
    },[manga])

    useEffect(() => {

        // If the mangaLanguage hasn't been set yet, return, since we can't fetch the chapter list without the language
        if (!mangaLanguage?.length) return;

        const paramConfig = getChapterListConfig(mangaLanguage);
        fetchChapterList(mangaID, paramConfig).then(respond => {
            setChapterList(respond);

            const options = respond.map((chapter, index) => {
                const chapterTitle = chapter.attributes?.title;
                const chapterNumber = chapter.attributes?.chapter || index + 1;
                return {
                    value: chapter.id,
                    label: chapterTitle ? `${chapterNumber} - ${chapterTitle}` : `Chapter ${chapterNumber}`
                }
            })

            setSelectorOptions(options);
        })

    }, [mangaLanguage])



    //starting to fetch all the chapter images as into an array once metadata is fetched
    useEffect(() => {
        if (metaData) {
            const pageURLs = [];

            metaData.chapter.data.forEach(data => {
                const url = `${process.env.PROXY_URL}/chapter-image/${metaData.baseUrl}/data/${metaData.chapter.hash}/${data}`;
                pageURLs.push(url);
                //console.log("imageURL: " + url, ", pageURLs current size: " + pageURLs.length);
            });

            setImageUrlArray(pageURLs);
        }
    }, [metaData]);

    //setting the first page of the chapter when the imageUrlArray are set
    useEffect(() => {
        if (imageUrlArray.length != 0){
            setImageURL(imageUrlArray[0]);
            setPageNumber(1);
            setIsLoadingData(false);
        }
    }, [imageUrlArray])


    
    function nextPg(){
        if(pageNumber == imageUrlArray.length){
            nextChapter();
            return;
        }
        
        setIsImageLoading(true);

        const nextPage = pageNumber + 1;
        setPageNumber(nextPage);
        setImageURL(imageUrlArray[nextPage - 1]); // Have to minus 1 because the imageUrl starts at index 0, but the page number starts at 1
    }


    
    function previousPg(){
        if(pageNumber == 1){
            previousChapter();
            return;
        }
        
        setIsImageLoading(true);

        const previousPage = pageNumber - 1;
        setPageNumber(previousPage);
        setImageURL(imageUrlArray[previousPage - 1]); // Have to minus 1 because the imageUrl starts at index 0, but the page number starts at 1
    }

    function nextChapter(){
        const nextChapterIndex = chapterList.findIndex(chapter => chapter.id === chapterID) + 1;
        //If it is out of bound, return to details page
        if (nextChapterIndex >= chapterList.length){
            navigate(`/comic/${mangaID}`);
            return;
        }

        const nextChapter = chapterList[nextChapterIndex];
        navigate(`/comic/${mangaID}/chapter/${nextChapter.id}`); 
    }

    function previousChapter() {
        const previousChapterIndex = chapterList.findIndex(chapter => chapter.id === chapterID) - 1;
        if (previousChapterIndex < 0){
            navigate(`/comic/${mangaID}`);
            return;
        }

        const previousChapter = chapterList[previousChapterIndex];
        navigate(`/comic/${mangaID}/chapter/${previousChapter.id}`);
    }

    function goToLastPage(){
        setImageURL(imageUrlArray[imageUrlArray.length - 1]);
        setPageNumber(imageUrlArray.length);
    }

    function goToFirstPage(){
        setImageURL(imageUrlArray[0]);
        setPageNumber(1);
    }


    return (
        <>
            {isLoadingData ? (
                <Skeleton width={"50rem"} height={"75rem"}/>
            ):(
                <div className="image-display-container">
                    <div className='reader-options'>
                        <Link to={`/comic/${mangaID}`} className='return-logo logo'>
                            <img src="/return-button.svg" className='return-logo logo' alt="return" />
                        </Link>
                        <div className='chapter-selector'>
                            <Select 
                                options={selectorOptions}
                                value={selectorOptions.find(option => option.value === chapterID)}
                                onChange={(selectedOption) => {
                                navigate(`/comic/${mangaID}/chapter/${selectedOption.value}`);
                                }}
                            />
                        </div>
                    </div>
                    <div className='chapter-image-container'>
                        {isImageLoading ? (<Skeleton width={'60rem'} height={'85rem'}/>) : (null)}
                        <img src={imgURL} onLoad={() => {setIsImageLoading(false)}} style={{ display: isImageLoading ? 'none' : 'block' }} alt="manga-content" className="chapter-image" onClick={nextPg} />
                    </div>
                    <div className='control-buttons-container'>
                        <div className="control-buttons">
                            <img src="/previous-to-start.svg" alt="to-start" className='logo' onClick={goToFirstPage}/>
                            <img src="/previous-page.svg" alt="previous" className="logo" onClick={previousPg} />
                            <p>{`${pageNumber}/${imageUrlArray.length}`}</p>
                            <img src="/next-page.svg" alt="next" className="logo" onClick={nextPg} />
                            <img src="/next-to-last.svg" alt="to-last" className='logo' onClick={goToLastPage}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Reader;