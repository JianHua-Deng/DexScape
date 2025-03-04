import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";


export default function ChapterImage({imgURL, imgStyle, onClick}){

  const [isImageLoading, setIsImageLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsImageLoading(true);
  }, [imgURL]);


  // If the image is already loaded (from cache), update the state.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsImageLoading(false);
    }
  }, [imgURL]);
  

  return (
    <>
      {isImageLoading && (
        <div className="w-full">
          <Skeleton className="w-full aspect-[3/4]" />
        </div>
      )}

      <img
        ref={imgRef}
        src={imgURL}
        onLoad={() => {
          setIsImageLoading(false);
        }}
        style={{ display: isImageLoading ? "none" : "block" }}
        alt="image-content"
        className={ imgStyle }
        onClick={onClick}
      />
    </>
  )
}