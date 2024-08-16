import './DetailsSkeleton.css'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function DetailsSkeleton() {

    return (
        <>
            <div className="details-skeleton-container">
                <div className='cover-skeleton'>
                    <Skeleton
                        width={"20rem"} 
                        height={"30rem"} 
                    />  
                </div> 

                <div className="details-skeleton">
                    <Skeleton width={"60rem"} height={"5rem"} className='title-skeleton'/>
                    <Skeleton count={10}/>
                </div>
            </div>

            <div className="chapters-list-skeleton-container">
                <div className='category-skeleton'>
                    <Skeleton width={"25rem"} height={"4rem"} />
                </div>
                <Skeleton height={"2rem"} count={15}/>
            </div>
        </>
        
    );
}

export default DetailsSkeleton;