import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function MangaPreviewSkeleton({ amount }) {
  return (
    <div className="flex flex-wrap justify-center items-center w-full gap-4">
      {Array.from({ length: amount }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-[8rem] lg:max-w-[15rem] flex flex-col items-center"
        >
          {/* Image Skeleton */}
          <div className="w-full aspect-[0.68]">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Title (and author) Skeleton(s) */}
          <div className="flex flex-col justify-center mt-1">
            <Skeleton className="w-full max-w-[8rem] lg:max-w-[15rem] h-4 mb-[0.1rem]" />
              <Skeleton className="w-full max-w-[8rem] lg:max-w-[15rem] h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MangaPreviewSkeleton;
