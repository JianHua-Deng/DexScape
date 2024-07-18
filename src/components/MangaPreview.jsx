import '../styles/MangaPreview.css'

function MangaPreview({manga, index}){
    
    return (
        <>
            <div className="manga-item" key={`${manga.id}`} id={`${index}`}>
                <img src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.256.jpg`} alt="" /> 
                <p>{`${manga.attributes.title.en}`}</p>
            </div>
        </>
    );
}

export default MangaPreview;