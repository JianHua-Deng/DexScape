import { searchPopularUploads } from "../../Utils/APICalls/MangaDexApi";
import { useEffect, useState } from "react";

function PopularUploads(){
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [popularMangas, setPopularMangas] = useState([]);

    useEffect(() => {
        setLoadingStatus(true);
        searchPopularUploads().then(resp => {
            setPopularMangas(resp);
        }).catch(e => {console.log(e)}).finally(() => {
            setLoadingStatus(false);
        })
    },[]);

}

export default PopularUploads;