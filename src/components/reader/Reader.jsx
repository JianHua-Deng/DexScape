import nextLogo from './../../assets/next-svgrepo-com.svg'
import nextChapLogo from './../../assets/next-998-svgrepo-com.svg'
import previousLogo from './../../assets/previous-svgrepo-com.svg'
import previousChapLogo from './../../assets/previous-999-svgrepo-com.svg'

import './Reader.css'
import { useEffect, useState } from 'react';
import { useParams} from "react-router-dom";
import { getChapterMetaData } from '../../Utils/APICalls/MangaDexApi';

function Reader(){

    const { chapterID } = useParams();
    const [metaData, setMetaData] = useState(null);
    const [imageUrlArray, setImageUrlArray] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [imgURL, setImageURL] = useState('');
    const [pageNumber, setPageNumber] = useState(1);

    //fetching Metadatas
    useEffect(() => {
        setLoadingStatus(true);
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
                const url = `${metaData.baseUrl}/data/${metaData.chapter.hash}/${data}`;
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
            setLoadingStatus(false);
        }
    }, [imageUrlArray])
    
    function nextPg(){
        setPageNumber((currentPage) => {
            const nextPage = currentPage +  1;
            setImageURL(imageUrlArray[nextPage - 1]); // I have to do minus 1 because the imageUrlArray starts at index 0
            return nextPage;
        })
    }

    function previousPg(){
        setPageNumber((currentPage) => {
            const previousPg = currentPage - 1;
            setImageURL(imageUrlArray[previousPg - 1]); // I have to do minus 1 because the imageUrlArray starts at index 0
            return previousPg;
        })
    }

    return (
        <>
            {loadingStatus ? (
                <p>Loading</p>
            ):(
                <div className="image-display-container">
                    <img src={imgURL} alt="" className="chapter-image" onClick={nextPg} />
                    <div className="control-buttons-container">
                        <img src={previousLogo} alt="previous" className="previous-logo logo" onClick={previousPg} />
                        <p>{`${pageNumber}/${imageUrlArray.length}`}</p>
                        <img src={nextLogo} alt="next" className="next-logo logo" onClick={nextPg} />
                    </div>
                </div>
            )}
        </>
    );
}

export default Reader;