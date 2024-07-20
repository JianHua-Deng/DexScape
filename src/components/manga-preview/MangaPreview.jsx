import './MangaPreview.css'
import { Link } from 'react-router-dom';

function MangaPreview({manga}){
    
    return (
        <>
            <Link className="manga-item" id={`${manga.id}`} to={{
                pathname: `manga/${manga.id}`,
                state: manga,
            }
            }>
                <div className="manga">
                    <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.256.jpg`} alt="" /> 
                    <p>{`${manga.attributes.title.en}`}</p>
                </div>
            </Link>
        </>
    );
}

export default MangaPreview;