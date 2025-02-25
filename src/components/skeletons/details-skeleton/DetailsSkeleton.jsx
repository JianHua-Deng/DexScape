import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function DetailsSkeleton() {
    return (
        <>
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-8 bg-white dark:bg-secDarkBg rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
                  <div className="w-full sm:w-80 col-span-1">
                      <Skeleton
                          width="100%"
                          height="30rem"
                          className="min-h-fit"
                      />
                  </div>

                  <div className="flex flex-col gap-6 text-start w-full">
                      <Skeleton width="80%" height="5rem" className="justify-self-start"/>
                      <Skeleton count={6}/>
                      <div className="flex flex-wrap gap-3">
                        {
                          Array.from({ length: 4}).map((_, index) => ((
                            <Skeleton key={index} width="4rem" height="1.5rem" />
                          )))
                        }
                      </div>
                      <Skeleton width="12rem" height="3.5rem" />
                  </div>
              </div>

            <div className="p-6 bg-white dark:bg-secDarkBg rounded-2xl shadow-lg mt-8">
              <div className="flex flex-col gap-6 p-4">
                  <div className="text-start w-full lg:w-96">
                      <Skeleton width="10rem" height="4rem" />
                  </div>
                  <div>
                    <Skeleton height="2rem" count={15}/>
                  </div>
              </div>
            </div>
          </div>
        </>
    );
}

export default DetailsSkeleton;