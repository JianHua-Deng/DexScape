import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";


export default function ChapterImage({imgURL, imgStyle, onClick, handleImgLoaded}){

  const [isImageLoading, setIsImageLoading] = useState(true);
  const imgRef = useRef(null);
  const timerRef = useRef(null); 

  useEffect(() => {
    setIsImageLoading(true);

    // Clear existing timer
    if (timerRef.current){
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (isImageLoading){
        toast( (t) => (
          <span>
            <p className="font-bold">Image is taking a bit too long to load</p>
            <br/>
            <p className="font-extralight">The Mangadex server might be too busy right now...</p>
          </span>
        ),
        { position: 'top-right',
          duration: 6000
        }
        );
      }
    }, 40000); // 40s = 40000ms

    // Cleanup timer on unmount or before re-running effect
    return () => clearTimeout(timerRef.current);

  }, [imgURL]);


  // If the image is already loaded (from cache), update the state.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsImageLoading(false);
      clearTimeout(timerRef.current);
    }
  }, [imgURL]);
  

  return (
    <>
      {isImageLoading && (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[60rem]">
          <div className="w-full">
            <Skeleton className="w-full aspect-[4/5]" />
          </div>
        </div>
      )}

      <img
        ref={imgRef}
        src={imgURL}
        onLoad={() => {
          setIsImageLoading(false);
          if (handleImgLoaded) {
            handleImgLoaded(prev => prev + 1);
          }
          clearTimeout(timerRef.current);
        }}
        style={{ display: isImageLoading ? "none" : "block" }}
        alt="image-content"
        className={ imgStyle }
        onClick={onClick}
      />
    </>
  )
}