import './Reader.css';
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getChapterMetaData, searchSpecificManga, fetchChapterList } from '../../utils/mangaDexApi';
import Skeleton from 'react-loading-skeleton';
import { getChapterListConfig, getAvailableLanguages, filterDuplicateChapters } from '../../utils/utils';
import Select from 'react-select';

function Reader() {
  const navigate = useNavigate();
  const { mangaID, chapterID, page } = useParams();

  // Convert the page param to a number; default to 1 if not a valid number.

  //const [manga, setManga] = useState({});
  const [chapterList, setChapterList] = useState([]);
  const [mangaLanguage, setMangaLanguage] = useState([]);
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [imageUrlArray, setImageUrlArray] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [imgURL, setImageURL] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(page);

    // Fetch the manga data when mangaID or chapterID changes.
    useEffect(() => {
        setIsLoadingData(true);
        setIsImageLoading(true);
        searchSpecificManga(mangaID).then(respond => {
        setMangaLanguage(getAvailableLanguages(respond));
        });
    }, [mangaID, chapterID]);

  // Fetch chapter meta data whenever the chapterID changes.
  useEffect(() => {
    getChapterMetaData(chapterID).then(respond => {
      setMetaData(respond);
    });
  }, [chapterID]);

  // Once the available languages are set, fetch the chapter list.
  useEffect(() => {
    if (!mangaLanguage?.length) return;

    const paramConfig = getChapterListConfig(mangaLanguage);
    fetchChapterList(mangaID, paramConfig).then(respond => {
      const filteredChapterList = filterDuplicateChapters(respond);
      setChapterList(filteredChapterList);

      const options = filteredChapterList.map((chapter, index) => {
        const chapterTitle = chapter.attributes?.title;
        const chapterNumber = chapter.attributes?.chapter || index + 1;
        return {
          value: chapter.id,
          label: chapterTitle ? `${chapterNumber} - ${chapterTitle}` : `Chapter ${chapterNumber}`
        };
      });
      setSelectorOptions(options);
    });
  }, [mangaLanguage, mangaID]);

  // Once metaData is fetched, prepare the image URLs.
  useEffect(() => {
    if (metaData) {
      const pageURLs = metaData.chapter.data.map(data => {
        return `${process.env.PROXY_URL}/chapter-image/${metaData.baseUrl}/data/${metaData.chapter.hash}/${data}`;
      });
      setImageUrlArray(pageURLs);
    }
  }, [metaData]);

  // Whenever the URL page param or the list of image URLs changes,
  // update the displayed page and image.
  useEffect(() => {
    // Ensure we have loaded the image URL array
    if (imageUrlArray.length > 0) {
      const numPage = parseInt(page, 10) || 1;
      // Bound the page number within valid limits.
      const validPage = Math.min(Math.max(numPage, 1), imageUrlArray.length);
      setPageNumber(validPage);
      setImageURL(imageUrlArray[validPage - 1]);
      setIsLoadingData(false);
    }
  }, [page, imageUrlArray]);

  // Navigation functions update the URL so that the page param stays in sync.
  function nextPg() {
    setIsImageLoading(true);
    if (pageNumber === imageUrlArray.length) {
      nextChapter();
      return;
    }
    const nextPage = pageNumber + 1;
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${nextPage}`);
  }

  function previousPg() {
    setIsImageLoading(true);
    if (pageNumber === 1) {
      previousChapter();
      return;
    }
    const previousPage = pageNumber - 1;
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${previousPage}`);
  }

  function nextChapter() {
    const currentIndex = chapterList.findIndex(chapter => chapter.id === chapterID);
    const nextChapterIndex = currentIndex + 1;
    // If there is no next chapter, return to the details page.
    if (nextChapterIndex >= chapterList.length) {
      navigate(`/comic/${mangaID}`);
      return;
    }
    const nextChapter = chapterList[nextChapterIndex];
    navigate(`/comic/${mangaID}/chapter/${nextChapter.id}/1`);
  }

  function previousChapter() {
    const currentIndex = chapterList.findIndex(chapter => chapter.id === chapterID);
    const previousChapterIndex = currentIndex - 1;
    if (previousChapterIndex < 0) {
      navigate(`/comic/${mangaID}`);
      return;
    }
    const previousChapter = chapterList[previousChapterIndex];
    navigate(`/comic/${mangaID}/chapter/${previousChapter.id}/1`);
  }

  function goToLastPage() {
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${imageUrlArray.length}`);
  }

  function goToFirstPage() {
    navigate(`/comic/${mangaID}/chapter/${chapterID}/1`);
  }

  return (
    <div className="image-display-container">
      {isLoadingData ? (
        <div className='image-display-skeleton-container'>
          <div className='image-skeleton'>
            <Skeleton className='custom-skeleton' />
          </div>
        </div>
      ) : (
        <>
          <div className='reader-options'>
            <Link to={`/comic/${mangaID}`} className='return-logo logo'>
              <img src="/return-button.svg" className='return-logo logo' alt="return" />
            </Link>
            <div className='chapter-selector'>
              <Select
                options={selectorOptions}
                value={selectorOptions.find(option => option.value === chapterID)}
                onChange={(selectedOption) => {
                  // When selecting a new chapter, start on page 1.
                  navigate(`/comic/${mangaID}/chapter/${selectedOption.value}/1`);
                }}
              />
            </div>
          </div>
          <div className='chapter-image-container'>
            {isImageLoading && (
              <div className='image-skeleton'>
                <Skeleton className='custom-skeleton' />
              </div>
            )}
            <img
              src={imgURL}
              onLoad={() => { setIsImageLoading(false); }}
              style={{ display: isImageLoading ? 'none' : 'block' }}
              alt="manga-content"
              className="chapter-image"
              onClick={nextPg}
            />
          </div>
          <div className='control-buttons-container'>
            <div className="control-buttons">
              <img src="/previous-to-start.svg" alt="to-start" className='logo' onClick={goToFirstPage} />
              <img src="/previous-page.svg" alt="previous" className="logo" onClick={previousPg} />
              <p>{`${pageNumber}/${imageUrlArray.length}`}</p>
              <img src="/next-page.svg" alt="next" className="logo" onClick={nextPg} />
              <img src="/next-to-last.svg" alt="to-last" className='logo' onClick={goToLastPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reader;
