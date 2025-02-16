import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";


export default function ChapterImage({imgURL, imgStyle, onClick}){

  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setIsImageLoading(true);
  }, [imgURL])
  

  return (
    <>
      {isImageLoading && (
        <div className="w-full">
          <Skeleton className="w-full aspect-[5/6]" />
        </div>
      )}

      <img
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