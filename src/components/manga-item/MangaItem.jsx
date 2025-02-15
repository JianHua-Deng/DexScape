import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import { getCoverUrl } from '../../utils/mangaDexApi';

const MangaItem = ({ manga }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);

  const coverUrl = getCoverUrl(manga);
  const title = manga.attributes.title.en 
    ? manga.attributes.title.en 
    : Object.values(manga.attributes.title)[0];

  const authorName = manga.relationships.find(relationship => relationship.type === "artist")
    ?.attributes?.name || 'N/A';

  useEffect(() => {
    setIsImageLoading(true);
  }, []);

  return (
    <Link
      to={`/comic/${manga.id}`}
      className="
        group
        relative
        w-full max-w-[10rem] lg:max-w-[15rem]
        bg-white
        rounded-xl
        overflow-hidden
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {isImageLoading && (
          <Skeleton 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <img
          src={coverUrl}
          alt={title}
          style={{ display: isImageLoading ? 'none' : 'block' }}
          className="
            w-full h-full
            object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
          onLoad={() => setIsImageLoading(false)}
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="
          absolute bottom-0 left-0 right-0
          h-20
          bg-gradient-to-t from-black/70 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "/>
      </div>

      <div className="p-3">
        <Tooltip title={title} placement="bottom" arrow>
          <h4 className="
            font-medium
            text-sm sm:text-base
            truncate
            mb-1
            group-hover:text-blue-600
            transition-colors duration-300
          ">
            {title}
          </h4>
        </Tooltip>
        
        <p className="
          text-xs sm:text-sm
          text-gray-600
          truncate
        ">
          by {authorName}
        </p>
      </div>
    </Link>
  );
};

export default MangaItem;