import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton";
import { getCoverUrl } from "../../utils/mangaDexApi";
import { Link } from "react-router-dom";
import { getMangaTitle } from "../../utils/utils";


export default function MangaCard({ manga }){

  const [isImageLoading, setIsImageLoading] = useState(true);
  const coverUrl = getCoverUrl(manga);

  const title = getMangaTitle(manga);


  return (
    <Link
      to={`comic/${manga.id}`}
      className="group"
    >
      <div className="relative rounded-lg overflow-hidden">
        {isImageLoading && ( <Skeleton className="w-full h-64"/> )}
  
        <img 
          src={coverUrl}
          style={{display: isImageLoading ? 'none' : 'block'}}
          className="w-full h-64 object-cover transform transition-transform group-hover:scale-105"
          onLoad={() => {
            setIsImageLoading(false);
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90">
          <h3 className="text-white text-sm font-semibold truncate">
            {title || `N/A`}
          </h3>
        </div>
      </div>
    </Link>
  )

}