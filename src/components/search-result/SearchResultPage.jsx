import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { searchMangas } from "../../utils/mangaDexApi";
import { acclaimedSearchParams, latestSearchParams, defaultSearchConfig, scrollToStart, trendSearchParams } from '../../utils/utils';
import MangaPreviewSkeleton from '../skeletons/result-skeleton/MangaPreviewSkeleton';
import Pagination from "../pagination/Pagination";
import useWindowWidth from "../hooks/useWindowWidth";
import MangaItem from "../manga-item/MangaItem";

function SearchResultPage() {
  const numPerPage = 28;
  const windowWidth = useWindowWidth();

  const mainContainer = useRef(null);

  const dynamicPageRange = windowWidth < 762 ? 2 : 5;

  const { queryString, uuid, page, name } = useParams();
  const [mangaData, setMangaData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const offset = (parseInt(page, 10) - 1) * numPerPage; // Calculate offset (page 1 = offset 0)
  const path = location.pathname;
  let searchConfig = {};
  let title = '';

  if (path.includes("/acclaimed")) {
    searchConfig = { ...acclaimedSearchParams, limit: `${numPerPage}`, offset: offset };
    title = 'Popularly Acclaimed';

  } else if (path.includes("/latest")) {
    searchConfig = { ...latestSearchParams, limit: `${numPerPage}`, offset: offset };
    title = 'Latest';

  } else if (path.includes("/trend")) {
    searchConfig = {...trendSearchParams, limit: `${numPerPage}`, offset: offset};
    title = 'Trending';

  }else if (path.includes("/tag")) {
    searchConfig = {
      limit: `${numPerPage}`,
      includedTags: [uuid],
      includes: ["authors", "artist", "cover_art"],
      offset: offset,
    };
    title = `Results of tag "${name}"`;

  } else {
    searchConfig = { ...defaultSearchConfig, title: queryString, offset: offset };
    title = `Results of "${queryString}"`;
  }

  useEffect(() => {
    setLoadingStatus(true);
    searchMangas(searchConfig)
      .then((resp) => {
        setMangaData(resp.data);
        setTotalPage(getPageCount(resp.total));
        //console.log(`Total Manga: ${resp.total}, Total Page: ${Math.ceil(resp.total / numPerPage)}`);
      })
      .finally(() => {
        setLoadingStatus(false);
      });
  }, [queryString, location, page]);

  useEffect(() => {
    scrollToStart(mainContainer);
  }, [page]);

  function handlePageClicked({ selected }) {
    const segments = path.split('/');
    const basePath = segments.slice(0, -1).join('/');
    const newPage = selected + 1;
    navigate(`${basePath}/${newPage}`);
  }

  function getPageCount(total) {
    // API limit check: if offset > 10000, adjust accordingly.
    if (total > 10000) {
      return Math.floor(10000 / numPerPage);
    } else {
      return Math.ceil(total / numPerPage);
    }
  }

  return (
    <div ref={mainContainer} className="flex flex-wrap gap-4 w-full h-full items-center justify-center px-4 lg:px-8">
      {!loadingStatus ? (
        <>
          <div className="w-full text-center mb-4 mt-4">
            <h2 className="dark:text-gray-100 text-2xl font-bold">{`「 ${title} 」`}</h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-4 sm:gap-x-8">
            {mangaData.length > 0 ? (
              mangaData.map((manga, index) => <MangaItem manga={manga} key={index} />)
            ) : (
              <div className="h-fit flex flex-col items-center justify-center gap-4">
                <img className="w-2/3 h-auto rounded-md" src="/bocchi-on-the-rocks.gif"/>
                <h3 className="text-darkText dark:text-lightText font-bold">No results were found</h3>
              </div>
            )}
          </div>
          <div className="w-full p-4 flex justify-evenly">
            <Pagination
              pageCount={totalPage}
              onPageChange={handlePageClicked}
              currentPage={parseInt(page, 10)}
              pageRange={dynamicPageRange}
              marginPagesDisplayed={1}
            />
          </div>
        </>
      ) : (
        <MangaPreviewSkeleton amount={30} />
      )}
    </div>
  );
}

export default SearchResultPage;
