import './DetailsSkeleton.css'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function DetailsSkeleton() {

    return (
        <>
            <div className="details-skeleton-container">
                <div className='cover-skeleton'>
                    <Skeleton
                        width={"100%"} 
                        height={"30rem"} 
                    />  
                </div> 

                <div className="details-skeleton">
                    <Skeleton width={"100%"} height={"5rem"} className='title-skeleton'/>
                    <Skeleton count={12}/>
                </div>
            </div>

            <div className="chapters-list-skeleton-container">
                <div className='category-skeleton'>
                    <Skeleton width={"100%"} height={"4rem"} />
                </div>
                <Skeleton height={"2rem"} count={15}/>
            </div>
        </>
        
    );
}

export default DetailsSkeleton;