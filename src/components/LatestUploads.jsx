import { useState } from "react";
import { useEffect } from "react";
import { searchLatestUploads } from "../Utils/APICalls/MangaDexApi";

function LatestUploads(){

    const [latestManga, setLatestManga] = useState([]);
    useEffect(() => {
        searchLatestUploads().then(resp => {
            setLatestManga(resp);
        }).catch(e => {console.log(e)});
    }, []);

    return (
        <>
            <div className="latest-uploads-container">
                <h2>Latest Uploads</h2>
                
            </div>
        </>
    );
}

export default LatestUploads;