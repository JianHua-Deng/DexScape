import './MangaPreview.css'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { getCoverUrl } from '../../Utils/Utils';


function MangaPreview({manga}){

    const navigate = useNavigate();

    const coverUrl = getCoverUrl(manga);
    
    console.log("Cover Url: " + coverUrl);
    
    return (
        <>

            <div className="manga" onClick={() => {
                navigate(`/manga/${manga.id}`, {state: manga});
            }}>
                <img src={`${coverUrl}`} alt="" /> 
                <p>{`${manga.attributes.title.en}`}</p>
            </div>

        </>
    );
}

export default MangaPreview;