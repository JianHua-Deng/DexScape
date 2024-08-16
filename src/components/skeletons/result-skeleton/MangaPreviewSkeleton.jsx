import './MangaPreviewSkeleton.css'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function MangaPreviewSkeleton({amount, type}){

    return (

        type == 'search-results' ? (
            <div className="results-skeleton-container">
            {Array.from({ length: amount }).map((_, index) => (
                <div className="result" key={index}>
                    <Skeleton width={"17rem"} height={"25rem"} />
                    <div className="title-author-skeleton">
                        <Skeleton width={"15rem"} />
                        <Skeleton width={"10rem"} />
                    </div>
                </div>
            ))}
            </div>
        ):(
            <div className="featured-container">
            {Array.from({ length: amount }).map((_, index) => (
                <div className="result" key={index}>
                    <Skeleton width={"17rem"} height={"25rem"} />
                    <div className="title-author-skeleton">
                        <Skeleton width={"10rem"} />
                    </div>
                </div>
            ))}
            </div>
        )
    );
}

export default MangaPreviewSkeleton;