import { useParams, useLocation, useNavigate,} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../../utils/mangaDexApi";
import { popularSearchParams, latestSearchParams, defaultSearchConfig } from '../../utils/utils';
import MangaPreview from "../manga-preview/MangaPreview";
import './SearchResultPage.css';
import MangaPreviewSkeleton from '../skeletons/result-skeleton/MangaPreviewSkeleton';
import Pagination from "../pagination/Pagination";

function SearchResultPage() {

    const {queryString, uuid, page, name} = useParams();

    const numPerPage = 30;

    const [mangaData, setMangaData] = useState([]);
    const[totalPage, setTotalPage] = useState(0);
    const [totalManga, setTotalManga] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();

    const offset = (parseInt(page, 10) - 1) * numPerPage; // Calculate offset based on page, subtract 1 because page 1 starts at offset 0
    const path = location.pathname;
    var searchConfig = {};
    var title = '';
    
    //console.log("Pathname: " + location.pathname + ", Key: " + uuid);
    
    if(path.includes("/popular")){
        //console.log("Ran popular");
        searchConfig = {...popularSearchParams, limit: `${numPerPage}`, offset: offset};
        title = 'Popular';
    }else if (path.includes("/latest")){
        //console.log("Ran latest");
        searchConfig = {...latestSearchParams, limit: `${numPerPage}`, offset: offset};
        title = 'Latest'
    } else if (path.includes("/tag")){
        //console.log("Ran tag");
        searchConfig = {
            limit: `${numPerPage}`,
            'includedTags': [uuid],
            includes: ["authors", "artist", "cover_art"],
            offset: offset,
        }
        title = `Results of tag "${name}"`;    
    }else{
        //console.log("Ran Default");
        searchConfig = {...defaultSearchConfig, title: queryString, offset: offset};
        title = `Results of "${queryString}"`;
    }
    

    //Loading first time / Reloading after a new search
    useEffect(() => {
        setLoadingStatus(true);
        searchMangas(searchConfig).then((resp) =>{
            setMangaData(resp.data);
            setTotalManga(resp.total);
            setTotalPage(Math.ceil(resp.total / numPerPage));
        }).finally(() => {
            setLoadingStatus(false);
        })
        
    }, [queryString, location, page]);

    // The parameter of "value" will be either a negative or positive of however many pages
    function handlePageClicked({ selected }) {

            const segments = path.split('/'); // Breaking the path to segments
            const basePath = segments.slice(0, -1).join('/'); // Get all segments except the last one
            const newPage = selected + 1; 
            
            navigate(`${basePath}/${newPage}`)
        
    }

    return(
        <div className="search-result-container">
            
            {!loadingStatus ? (
                <>
                    <div className="title-container">
                        <h2 className='query-title'>{title}</h2>
                    </div>                
                    <div className='results-container'>
                        {mangaData.length > 0 ? (
                            mangaData.map((manga, index) => (
                                <MangaPreview manga={manga} version={"preview"} key={index}/>
                            ))
                        ) : (
                            <span>No results were found</span>
                        )}
                    </div>
                    <div className="controls-container">
                        <Pagination
                            pageCount={totalPage}
                            onPageChange={handlePageClicked}
                            currentPage={parseInt(page, 10)}
                            pageRange={3}
                            marginPagesDisplayed={1}
                        />
                    </div>
                </>
                ):(
                    <MangaPreviewSkeleton amount={24} type={"search-results"}/>
                )
            }
        </div>
    );
}


export default SearchResultPage;