import { useEffect, useState } from "react";
import { getCoverUrl } from "../../utils/mangaDexApi";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Skeleton from "react-loading-skeleton";

export default function SliderItem({ manga, nextSlide, prevSlide }) {
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
    const [isCoverLoading, setIsCoverLoading] = useState(false);
    const coverUrl = getCoverUrl(manga);

    useEffect(() => {
      setIsBackgroundLoading(true);
      setIsCoverLoading(true);
    }, [])

    function handleArrowClick(e, direction) {
      e.preventDefault();
      direction();
    }

    return (
      <Link className="w-full max-h-[550px]" to={`/comic/${manga.id}`}>
        <div className="relative h-[450px] lg:h-[550px] w-full overflow-hidden">
            {/* Background image with blur effect */}
            <div className="absolute w-full inset-0">
              <div className="absolute w-full inset-0 bg-gradient-to-r from-black/80 to-black/20 z-10" />
                <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black/90 to-transparent z-20" />
                {isBackgroundLoading && (
                  <Skeleton className="w-full h-full"/>
                )}

                <img 
                    src={coverUrl}
                    alt="background"
                    style={{display: isBackgroundLoading ? 'none' : 'block'}}
                    className="w-full h-full object-cover"
                    onLoad={() => setIsBackgroundLoading(false)}
                />
            </div>

            {/* Content overlay */}
            <div className="flex flex-col justify-center items-center h-full">
              <div className="relative z-20 h-full flex flex-row items-center px-8 md:px-16 gap-8">
                  {/* Cover image */}
                  <div className="flex-shrink-0">
                    {isCoverLoading && (
                      <Skeleton className="w-36 h-52 lg:w-52 lg:h-72"/>
                    )}

                    <img 
                        src={coverUrl}
                        alt={manga.attributes?.title?.en || "Manga cover"}
                        style={{display: isCoverLoading ? 'none' : 'block'}}
                        className="w-36 h-auto lg:w-56 object-cover rounded shadow-lg hover:scale-105 transition-transform duration-300"
                        onLoad={() => setIsCoverLoading(false)}
                    />
                  </div>
  
                  {/* Manga details */}
                  <div className="flex flex-col text-white max-w-2xl">
                      <h2 className="text-xl lg:text-4xl font-bold mb-3">
                          {manga.attributes?.title?.en}
                      </h2>
                      <div className="flex gap-2 mb-4">
                          {manga.attributes?.tags?.map((tag, index) => (
                              <span 
                                  key={index}
                                  className="px-3 py-1 bg-white/30 rounded-sm lg:rounded-full text-sm hidden lg:block"
                              >
                                  {tag.attributes?.name?.en}
                              </span>
                          )).slice(0, 4)}
                      </div>

                      <div className="hidden lg:block">
                          <p className="max-h-[150px] line-clamp-5 text-lg text-gray-200 overflow-hidden text-ellipsis">
                              {manga.attributes?.description?.en}
                          </p>
                      </div>
                  </div>
              </div>


            </div>
        </div>
      </Link>
    );

}