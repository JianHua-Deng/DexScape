import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function DetailsSkeleton() {
    return (
        <>
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-12 p-2 lg:p-20 bg-[var(--side-bg-color)]">
                <div className="w-full sm:w-80">
                    <Skeleton
                        width="100%"
                        height="30rem"
                        className="min-h-fit"
                    />
                </div>
                <div className="flex-1 grid gap-20 text-start w-full">
                    <Skeleton width="100%" height="5rem" className="justify-self-start"/>
                    <Skeleton count={12}/>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="text-start w-full lg:w-96">
                    <Skeleton width="100%" height="4rem" />
                </div>
                <Skeleton height="2rem" count={15}/>
            </div>
        </>
    );
}

export default DetailsSkeleton;