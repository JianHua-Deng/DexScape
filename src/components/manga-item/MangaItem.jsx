import { getCoverUrl } from '../../utils/mangaDexApi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import Skeleton from 'react-loading-skeleton';

export default function MangaItem({ manga }) {

  const [isImageLoading, setIsImageLoading] = useState(false);

  const coverUrl = getCoverUrl(manga);
  const title = manga.attributes.title.en 
    ? manga.attributes.title.en 
    : Object.values(manga.attributes.title)[0];  


  const authorName = manga.relationships.find(relationship => relationship.type === "artist")
  ?.attributes?.name || 'N/A';

  const description = manga.attributes.description.en

  useEffect(() => {
    setIsImageLoading(true);
  }, [])

  return (
    <Link
    to={`/comic/${manga.id}`}
    className="
      w-full max-w-[8rem] h-fit
      lg:max-w-[15rem]
      flex flex-col items-center
      rounded-b-sm
      hover:shadow-[0_1px_5px_var(--box-shadow-color)] 
      cursor-pointer
    "
  >

    {isImageLoading && (
          <div className="w-full aspect-[0.68]">
            <Skeleton className="w-full h-full" />
          </div>
    )}

    <img
      src={coverUrl}
      alt="cover"
      style={{display: isImageLoading ? 'none' : 'block'}}
      className="
        w-full h-auto
        justify-self-center self-center 
        row-span-2"
      onLoad={() => setIsImageLoading(false)}
    />

    <div className="flex flex-col justify-center">
      <Tooltip title={title} placement="bottom" arrow>
        <h4
          className="
            max-w-[8rem] no-underline 
            overflow-ellipsis whitespace-nowrap 
            justify-self-center self-center mt-1 mb-[0.1rem]
            text-sm sm:text-base md:text-lg
            lg:max-w-[15rem]
          "
        >
          {title}
        </h4>
        </Tooltip>
      <p className="mt-[0.1rem] text-xs sm:text-base">
        {authorName}
      </p>
    </div>
  </Link>
  );

}