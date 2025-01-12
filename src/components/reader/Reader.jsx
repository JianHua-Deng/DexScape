import nextLogo from './../../assets/next-svgrepo-com.svg'
import previousLogo from './../../assets/previous-svgrepo-com.svg'
import returnLogo from './../../assets/return-button-svgrepo-com.svg'

import './Reader.css'
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams} from "react-router-dom";
import { getChapterMetaData } from '../../Utils/APICalls/MangaDexApi';
import Skeleton from 'react-loading-skeleton'

function Reader(){

    const navigate = useNavigate();
    //getting the state that's passed through Navigate
    const location = useLocation();
    const manga = location.state;

    const { chapterID } = useParams();
    const [metaData, setMetaData] = useState(null);
    const [imageUrlArray, setImageUrlArray] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [imgURL, setImageURL] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    //fetching Metadatas
    useEffect(() => {
        setIsLoadingData(true);
        getChapterMetaData(chapterID).then(respond => {
            //console.log(respond);
            setMetaData(respond);
        })
    }, [])

    //starting to fetch all the chapter images as into an array once metadata is fetched
    useEffect(() => {
        if (metaData) {
            const pageURLs = [];

            metaData.chapter.data.forEach(data => {
                const url = `${process.env.PROXY_URL}/chapter-image/${metaData.baseUrl}/data/${metaData.chapter.hash}/${data}`;
                pageURLs.push(url);
                console.log("imageURL: " + url, ", pageURLs current size: " + pageURLs.length);
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
            navigate(`/comic/${manga.id}`, {state: manga});
            return;
        }
        
        setIsImageLoading(true);
        setPageNumber((currentPage) => {
            const nextPage = currentPage +  1;
            if (nextPage <= imageUrlArray.length){
                setImageURL(imageUrlArray[nextPage - 1]); // I have to do minus 1 because the imageUrlArray starts at index 0
                return nextPage;
            }
            return currentPage;
        })
    }


    
    function previousPg(){

        setIsImageLoading(true);
        setPageNumber((currentPage) => {
            const previousPage = currentPage - 1;
            if (previousPage >= 1){
                setImageURL(imageUrlArray[previousPage - 1]); // I have to do minus 1 because the imageUrlArray starts at index 0
                return previousPage;
            }
            return currentPage;

        })
    }

    function handleImageLoad() {
        setIsImageLoading(false);
        console.log('Set to false');
    }


    return (
        <>
            {isLoadingData ? (
                <Skeleton width={"50rem"} height={"75rem"}/>
            ):(
                <div className="image-display-container">
                    <div className='return-logo-container'>
                        <img src={returnLogo} alt="return" className='return-logo logo' onClick={() => {navigate(`/comic/${manga.id}`, {state: manga});}}/>
                    </div>
                    <div className='chapter-image-container'>
                        {isImageLoading ? (<Skeleton width={'60rem'} height={'85rem'}/>) : (null)}
                        <img src={imgURL} onLoad={handleImageLoad} style={{ display: isImageLoading ? 'none' : 'block' }} alt="manga-content" className="chapter-image" onClick={nextPg} />
                    </div>
                    <div className='control-buttons-container'>
                        <div className="control-buttons">
                            <img src={previousLogo} alt="previous" className="previous-logo logo" onClick={previousPg} />
                            <p>{`${pageNumber}/${imageUrlArray.length}`}</p>
                            <img src={nextLogo} alt="next" className="next-logo logo" onClick={nextPg} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Reader;