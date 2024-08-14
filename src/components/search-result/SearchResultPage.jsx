import nextLogo from './../../assets/next-svgrepo-com.svg'
import previousLogo from './../../assets/previous-svgrepo-com.svg'

import { useParams, useLocation, useNavigate,} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../../Utils/APICalls/MangaDexApi";
import { popularSearchParams, latestSearchParams, defaultSearchConfig } from '../../Utils/Utils';
import MangaPreview from "../manga-preview/MangaPreview";
import './SearchResultPage.css';

function SearchResultPage() {

    const {queryString} = useParams();
    const {page} = useParams();
    const {uuid} = useParams();

    const [mangaData, setMangaData] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    //const [searchConfig, setSearchConfig] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    const offset = (parseInt(page, 10) - 1) * 24; // Calculate offset based on page
    const path = location.pathname;
    var searchConfig = {};
    
    //console.log("Pathname: " + location.pathname + ", Key: " + uuid);


    
    if(path.includes("/popular")){
        //console.log("Ran popular");
        searchConfig = {...popularSearchParams, limit: 24, offset: offset};
    }else if (path.includes("/latest")){
        console.log("Ran latest");
        searchConfig = {...latestSearchParams, limit: 24, offset: offset};
    } else if (path.includes("/tag")){
        //console.log("Ran tag");
        searchConfig = {
            limit: 24,
            'includedTags': [uuid],
            includes: ["authors", "artist", "cover_art"],
            offset: offset,
        }    
    }else{
        //console.log("Ran Default");
        searchConfig = {...defaultSearchConfig, title: queryString, offset: offset};
    }
    

    //Loading first time / Reloading after a new search
    useEffect(() => {
        setLoadingStatus(true);
        searchMangas(searchConfig).then((resp) =>{
            setMangaData(resp);
        }).finally(() => {
            setLoadingStatus(false);
        })
        
    }, [queryString, location, page]);

    /*
    function offsetPages(operationValue){ //Operation value will either be negative, meaning we trying to go back a page, or a positive value, meaning going to next page
        const offsetPg = offset + operationValue;
        if(offsetPg >= 0){
            setLoadingStatus(true);
            searchMangas({...searchConfig, offset: offsetPg}).then((respond) => {
                if(respond && respond.length != 0){
                    console.log(respond);
                    setMangaData(respond);
                    setOffset(offsetPg);
                    setPage((current) => {
                        return (operationValue < 0) ? current - 1 : current + 1;
                    });
                }
                console.log("Length: " + respond.length);
            }).finally(()=>{
                setLoadingStatus(false);
            })
        }
    }
    */

    function handleNavigate(value) {

        // check if page is already at 1 and if it is trying to go below that, this is to prevent page going to negative numbers
        // checks if the data is already less than the limit, if it is, that means that's the maximum amount available

            const segments = path.split('/');
            const basePath = segments.slice(0, -1).join('/'); // Get all segments except the last one
            const newPage = parseInt(page) + parseInt(value);
            
            if (newPage < 1 || mangaData.length < 24) return;
            navigate(`${basePath}/${newPage}`)
        
    }

    

    return(
        <div className="search-result-container">
            
            {mangaData.length > 0 || !loadingStatus ? (
                <>
                    {mangaData.map((manga, index) => (
                        <MangaPreview manga={manga} version={"preview"} key={index}/>
                    ))}
                    <div className="controls-container">
                        <img src={previousLogo} className="previous-logo logo" onClick={() => {handleNavigate(-1)}}/>
                        <p>{page}</p>
                        <img src={nextLogo} className="next-logo logo" onClick={() => {handleNavigate(1)}}/>
                    </div>
                </>
                ):(
                    <p>Loading</p>
            )
            }
        </div>
    );
}


export default SearchResultPage;