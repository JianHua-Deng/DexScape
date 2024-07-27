import './MangaPreview.css'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function MangaPreview({manga}){

    const navigate = useNavigate();

    const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000' // For development
    : 'https://manga-site-production.up.railway.app'; // Replace with actual Railway domain
    const PORT = import.meta.env.VITE_PORT || 3000;
    const params = `${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`;
    const coverUrl = `${baseUrl}/covers/${params}`;
    
    console.log("Cover Url: " + coverUrl + ", Port: " + PORT);
    
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