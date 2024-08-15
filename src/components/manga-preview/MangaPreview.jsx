import './MangaPreview.css'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { getCoverUrl } from '../../Utils/Utils';


function MangaPreview({manga, version}){

    const navigate = useNavigate();
    const coverUrl = getCoverUrl(manga);
    const artists = manga.relationships.filter(relationship => relationship.type === "artist");
    
    //console.log("Cover Url: " + coverUrl);
    
    return (
        <>
        {version == "cover" ? (
            <div className="manga-cover-container" onClick={() => {
                navigate(`/comic/${manga.id}`, {state: manga});
            }}>
                <img src={`${coverUrl}`} alt="" className='cover' /> 
                <p className='manga-preview-title'>{manga.attributes.title.en ? manga.attributes.title.en : manga.attributes.title['ja-ro']}</p>
            </div>            

        ) : (
            <div className="manga-preview-container" onClick={() => {
                navigate(`/comic/${manga.id}`, {state: manga});
            }}>
                <img src={`${coverUrl}`} alt="" className='preview-cover' /> 
                <div className='preview-description-container'>
                    <h3 className='manga-preview-title'>{`${manga.attributes.title.en ? manga.attributes.title.en : manga.attributes.title['ja-ro'] || 'N/A'}`}</h3>
                    <p className='preview-author'>{`${manga.relationships.find(relationship => relationship.type === "artist")?.attributes?.name || 'N/A'}`}</p>
                </div>
            </div>

        )}


        </>
    );
}

export default MangaPreview;