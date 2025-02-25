import React, { useEffect, useState } from 'react';
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import { format } from 'date-fns';
import { getCoverUrl } from '../../utils/mangaDexApi';
import { Link } from 'react-router-dom';
import { getMangaTitle } from '../../utils/utils';
import Skeleton from 'react-loading-skeleton';
import { Star } from '@mui/icons-material';
import { colors } from '../../utils/colors';  

export default function HistoryMangaCard ({ manga, readAt, chapter, page, onDelete }) {
  const { theme } = useThemeProvider();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isDark = theme === "dark";

  // Format the read date
  const formattedDate = readAt ? format(new Date(readAt), 'MMM dd, yyyy - HH:mm') : 'Unknown date';
  const coverUrl = getCoverUrl(manga);
  const title = getMangaTitle(manga);

  return (
    <Link
      to={`/comic/${manga.id}`}
      className='w-full'
    >
      <div className={`w-full mb-4 p-4 rounded-lg transition-all duration-200 ${
        isDark ? 'bg-secDarkBg hover:bg-lightDark' : 'bg-gray-200 hover:bg-gray-300'
      }`}>
        <div className="flex flex-col justify-center sm:flex-row items-center sm:items-center gap-4">
          {/* Manga Cover */}
          <div className="w-24 h-32 flex-shrink-0">
            {isImageLoading && <Skeleton className='w-full h-full'/>}
            <img
              src={coverUrl}
              alt={title}
              className={`${isImageLoading ? 'hidden' : 'block'} w-full h-full object-cover rounded-md shadow-md`}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
  
          {/* Manga Details */}
          <div className="flex-grow">
            <div className="flex flex-col gap-2">
              <div className='w-full flex justify-between'>
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-lightText' : 'text-darkText'
                }`}>
                  {title}
                </h3>
                {onDelete ? (
                  <Star 
                  style={{ color: `${colors.starColor}` }} 
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await onDelete(manga.id);
                  }} />
                ) : (
                  null
                )}
              </div>
              
              {chapter && page ? (
                <div className='w-full flex flex-col justify-between sm:flex-row'>
                  <div className='flex flex-col'>
                    <p className={`text-sm ${ isDark ? 'text-lightText/80' : 'text-darkText/80'}`}>
                      Left off at Chapter: {chapter}
                    </p>
                    {/*
                    <p className={`text-sm ${ isDark ? 'text-lightText/80' : 'text-darkText/80'}`}>
                      Page: {page}
                    </p>
                    */}
                  </div>

                  <p className={`text-sm ${
                    isDark ? 'text-lightText/80' : 'text-darkText/80'
                  }`}>
                    Last read: {formattedDate}
                  </p>
                </div>
              ) : (
                null
              )}
  
              {manga.attributes?.description?.en && (
                <p className={`text-sm line-clamp-2 ${
                  isDark ? 'text-lightText/70' : 'text-darkText/70'
                }`}>
                  {manga.attributes.description.en}
                </p>
              )}
  
              <div className="flex flex-wrap gap-2 mt-1">
                {manga.attributes?.tags?.slice(0, 3).map(tag => (
                  <span
                    key={tag.id}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDark 
                        ? 'bg-mangaItemBg text-lightText/90' 
                        : 'bg-darkBlue text-lightText'
                    }`}
                  >
                    {tag.attributes?.name?.en || 'Unknown tag'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
