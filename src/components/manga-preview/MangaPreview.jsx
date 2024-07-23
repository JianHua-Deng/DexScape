import './MangaPreview.css'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function MangaPreview({manga}){

    const navigate = useNavigate();
    
    return (
        <>

            <div className="manga" onClick={() => {
                navigate(`/manga/${manga.id}`, {state: manga});
            }}>
                <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`} alt="" /> 
                <p>{`${manga.attributes.title.en}`}</p>
            </div>

        </>
    );
}

export default MangaPreview;