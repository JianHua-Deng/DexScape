import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getChapterMetaData, searchSpecificManga, fetchChapterList, getChapterInfo } from "../../utils/mangaDexApi";
import { getChapterListConfig, filterDuplicateChapters, scrollToStart, preLoadImages } from "../../utils/utils";
import Select from "react-select";
import ChapterImage from "../chapter-image/ChapterImage";
import getSelectorStyle from "../../utils/theme";
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, KeyboardArrowLeft, KeyboardArrowRight, ArrowBack } from '@mui/icons-material';
import { useAuth } from "../../lib/AuthContext";
import { updateUserReadingHistory } from "../../utils/supabase";
import { CircularProgress } from "@mui/material";


function Reader() {
  
  const navigate = useNavigate();
  const { mangaID, chapterID, page } = useParams();

  const [tags, setTags] = useState([]);
  const [isWebtoon, setIsWebtoon] = useState(false);

  const [chapterList, setChapterList] = useState([]);
  const [chapterData, setChapterData] = useState([]); // Specific informations about the current chapter
  const chapterLanguage = chapterData?.id === chapterID ? chapterData.attributes?.translatedLanguage : '';
  const detailsLink = chapterLanguage
    ? `/comic/${mangaID}?lang=${encodeURIComponent(chapterLanguage)}`
    : `/comic/${mangaID}`;
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [imageUrlArray, setImageUrlArray] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [imgURL, setImageURL] = useState("");
  const [pageNumber, setPageNumber] = useState(page); // Type integer version of "page"
  const [preLoadedImageIndex, setPreLoadedImageIndex] = useState(parseInt(page, 10));
  const [preLoadedImageSet, setPreloadedImageSet] = useState(new Set());

  const [webtoonLoadedImgCount, setWebtoonLoadedImgCount] = useState(0);
  const [isWebtoonLoaded, setIsWebtoonLoaded] = useState(false);

  const { theme } = useThemeProvider();
  const { session, userID } = useAuth();

  // Create a ref for the image container
  const imageContainerRef = useRef(null);

  // When pageNumber changes, scroll to the image container
  useEffect(() => {

    scrollToStart(imageContainerRef);

  }, [page, chapterID, isLoadingData, isWebtoonLoaded]);


  // Fetch manga format tags; the opened chapter determines the reading language.
  useEffect(() => {
    let active = true;
    setIsLoadingData(true);
    searchSpecificManga(mangaID).then((respond) => {
      if (!active) return;
      setTags(() => {
        return respond.attributes.tags.filter(tag => tag.attributes.group === 'format') ?? [];
      });
    }).catch(() => {
      if (active) setLoadError('Could not load manga information. Please try again.');
    });
    return () => { active = false; };
  }, [mangaID, retryCount]);

  // Fetch chapter meta data
  useEffect(() => {
    let active = true;
    setLoadError('');
    resetDataStates();
    setPreLoadedImageIndex(parseInt(page, 10)); // Resetting preLoadImageIndex when switching chapter
    
    // Reset webtoon loading informations
    setWebtoonLoadedImgCount(0);
    setIsWebtoonLoaded(false);
    
    Promise.all([getChapterMetaData(chapterID), getChapterInfo(chapterID)])
      .then(([metadata, chapter]) => {
        if (!active) return;
        setMetaData(metadata);
        setChapterData(chapter);
      })
      .catch(() => {
        if (active) setLoadError('Could not load this chapter. Please try again.');
      });
    return () => { active = false; };
  }, [chapterID, retryCount]);

  // Fetch chapter list once language is available
  useEffect(() => {
    let active = true;
    setChapterList([]);
    setSelectorOptions([]);
    if (!chapterLanguage) return;
    const paramConfig = getChapterListConfig([chapterLanguage]);

    fetchChapterList(mangaID, paramConfig).then((respond) => {

      if (!active) return;
      const currentChapter = respond.find(chapter => chapter.id === chapterID);
      const filteredChapterList = filterDuplicateChapters(respond).map(chapter => {
        if (currentChapter && chapter.attributes.chapter === currentChapter.attributes.chapter) {
          return currentChapter;
        }
        return chapter;
      });
      setChapterList(filteredChapterList);

      const options = filteredChapterList.map((chapter, index) => {
        const chapterTitle = chapter.attributes?.title;
        const chapterNumber = chapter.attributes?.chapter || index + 1;
        return {
          value: chapter.id,
          label: chapterTitle
            ? `${chapterNumber} - ${chapterTitle}`
            : `Chapter ${chapterNumber}`,
        };
      });
      setSelectorOptions(options);
    }).catch(() => {
      if (active) setLoadError('Could not load chapters in this language. Please try again.');
    });
    return () => { active = false; };
  }, [chapterLanguage, chapterID, mangaID, retryCount]);

  // Prepare image URLs from metaData
  useEffect(() => {
    if (metaData) {
      const pageURLs = metaData.chapter.data.map((data) => {
        return `${process.env.PROXY_URL}/chapter-image/${metaData.baseUrl}/data/${metaData.chapter.hash}/${data}`;
      });
      setImageUrlArray(pageURLs);
    }
  }, [metaData]);

  // Set current page and image when page param or image URL array changes
  useEffect(() => {
    if (imageUrlArray.length > 0) {
      const numPage = parseInt(page, 10) || 1;
      const validPage = Math.min(Math.max(numPage, 1), imageUrlArray.length);
      setPageNumber(validPage);
      //setPreLoadedImageIndex(validPage) // Since preLoadedImageIndex is 0 indexed, so it is fine it is set it to validPage, since it should be one image url ahead of the current image
      setImageURL(imageUrlArray[validPage - 1]);
      setIsLoadingData(false);
    }
  }, [page, imageUrlArray]);
  
  
  // Preload the image into browser by creating a Image object based on the image url
  // This useEffect should only run once when the imgUrlArray changes. Basically only run when the imgurls are ready
  useEffect(() => {
    if (imageUrlArray.length > 0) {
      const leftOffIndex = preLoadImages(imageUrlArray, preLoadedImageIndex, 5, preLoadedImageSet, setPreloadedImageSet);
      setPreLoadedImageIndex(leftOffIndex);
    }
  }, [imageUrlArray])
  

  useEffect(() => {
    // Wait for the current chapter and page, so history saves the correct language.
    if (!session || !userID || !chapterLanguage || isLoadingData) return;
    updateUserReadingHistory(
      userID, mangaID, chapterID, chapterData.attributes.chapter ?? null, pageNumber, chapterLanguage
    );
  }, [session, userID, mangaID, chapterID, chapterData, chapterLanguage, pageNumber, isLoadingData]);

  useEffect(() => {
    //console.log(tags);
    if (tags.some(tag => tag.attributes.name.en === "Long Strip")) {
      //console.log("It is a webtoon");
      setIsWebtoon(true);
    }
  }, [tags]);

  useEffect(() => {
    if (imageUrlArray.length > 0 && webtoonLoadedImgCount === imageUrlArray.length) {
      setIsWebtoonLoaded(true);
    }
  }, [webtoonLoadedImgCount]);


  // Basically resetting everything so the loading occur, and the spinner appears
  function resetDataStates() {
    setIsLoadingData(true); 
    setImageUrlArray([]);
    setMetaData(null);
    setChapterData(null);
  }

  function scrollDownOnClick(){
    const mainScrollContainer = document.querySelector(".main-scroll-container");
    if (mainScrollContainer) {
      mainScrollContainer.scrollBy({
        top: 750,
        behavior: "smooth",
      })
    }
  }

  // Navigation functions update the URL
  function nextPg() {

    if (pageNumber === imageUrlArray.length) {
      nextChapter();
      return;
    }

    if (imageUrlArray.length > 0) {
      const leftOffIndex = preLoadImages(imageUrlArray, preLoadedImageIndex, 1, preLoadedImageSet, setPreloadedImageSet);
      setPreLoadedImageIndex(leftOffIndex);
    }
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${pageNumber + 1}`);
  }

  function previousPg() {
    if (pageNumber === 1) {
      previousChapter();
      return;
    }
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${pageNumber - 1}`);
  }

  function nextChapter() {
    if (chapterList.length === 0) return;
    const currentIndex = chapterList.findIndex((chapter) => chapter.id === chapterID);
    const nextChapterIndex = currentIndex + 1;
    if (currentIndex < 0 || nextChapterIndex >= chapterList.length) {
      navigate(detailsLink);
      return;
    }
    const nextChapter = chapterList[nextChapterIndex];
    resetDataStates();
    navigate(`/comic/${mangaID}/chapter/${nextChapter.id}/1`);
  }

  function previousChapter() {
    if (chapterList.length === 0) return;
    const currentIndex = chapterList.findIndex((chapter) => chapter.id === chapterID);
    const previousChapterIndex = currentIndex - 1;
    if (previousChapterIndex < 0) {
      navigate(detailsLink);
      return;
    }
    const previousChapter = chapterList[previousChapterIndex];
    resetDataStates();
    navigate(`/comic/${mangaID}/chapter/${previousChapter.id}/1`);
  }

  function goToLastPage() {
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${imageUrlArray.length}`);
  }

  function goToFirstPage() {
    navigate(`/comic/${mangaID}/chapter/${chapterID}/1`);
  }

  return (

    <div className="flex flex-col w-full h-full items-center gap-4">
      {loadError ? (
        <div role="alert" className="p-8 text-center text-darkText dark:text-lightText">
          <p className="mb-4">{loadError}</p>
          <button onClick={() => setRetryCount(count => count + 1)}>Try again</button>
          <Link to={detailsLink} className="block mt-4">Back to manga details</Link>
        </div>
      ) : isLoadingData ? (
        <div className={`max-w-full h-screen flex justify-center items-center`}>
          <CircularProgress size={"5rem"}/>
        </div>
      ) : (
        <>

          <div className="flex justify-evenly mt-2 w-full max-w-72 gap-4 md:grid md:grid-cols-3 md:items-center md:w-full md:max-w-full">
            <Link
              to={detailsLink}
              className="self-center justify-self-start p-[0.3rem]"
            >
              <ArrowBack
                sx={{ fontSize: '2rem', ml: 2 }}
                className="dark:text-lightText hover:bg-darkHighlight dark:hover:bg-lightHighlight"
              />

            </Link>

            <div className="min-w-0 self-center justify-self-center col-start-2 col-end-3 p-[0.3rem] ">
              <Select
                isDisabled={selectorOptions.length === 0}
                isSearchable={false}
                styles={ getSelectorStyle(theme) }
                options={selectorOptions}
                value={selectorOptions.find(
                  (option) => option.value === chapterID
                )}
                onChange={(selectedOption) => {
                  resetDataStates();
                  navigate(
                    `/comic/${mangaID}/chapter/${selectedOption.value}/1`
                  );
                }}
              />
            </div>
          </div>

          
          <div ref={imageContainerRef} className={` ${isWebtoon ? 'h-auto items-start' : 'h-screen items-center'} flex w-full justify-center items-center ${isWebtoon? 'max-w-[60rem]' : 'max-w-full' }`}>
            
            {isWebtoon ? (
              
              <>
                <div className={`max-w-full h-screen flex justify-center items-center ${isWebtoonLoaded ? 'hidden' : 'flex'} `}>
                  <CircularProgress size={"5rem"}/>
                </div>

                <div className={`flex flex-col w-full h-full ${isWebtoonLoaded ? 'flex' : 'hidden'}`}>
                  {imageUrlArray.map((url, index) => (
                    <ChapterImage imgURL={url} imgStyle={"w-full h-auto"} onClick={scrollDownOnClick} handleImgLoaded={setWebtoonLoadedImgCount} key={index}/>
                  ))}
                </div>
              </>

            ) : (
              <ChapterImage imgURL={imgURL} imgStyle={"h-screen w-auto object-contain cursor-pointer"} onClick={nextPg} />
            )}

          </div>

          
          <div className="flex justify-center w-[20rem] lg:w-[30rem]">

            {isWebtoon ? (
              <div className="">
                <button onClick={nextChapter} className="rounded-lg bg-darkBlue px-6 py-3 mb-2 text-white">
                  Next Chapter
                </button>
              </div>

            ) : (
              
              <div className="w-full p-4 gap-4 lg:gap-8 flex justify-evenly items-center">
                <KeyboardDoubleArrowLeft
                  className="w-5 lg:w-12 h-auto cursor-pointer hover:bg-darkHighlight dark:hover:bg-lightHighlight dark:text-lightText"
                  onClick={goToFirstPage}
                />
                <KeyboardArrowLeft
                  className="w-5 lg:w-12 h-auto cursor-pointer hover:bg-darkHighlight dark:hover:bg-lightHighlight dark:text-lightText"
                  onClick={previousPg}
                />
                <p className="text-sm lg:text-xl dark:text-lightText ">
                  {`${pageNumber}/${imageUrlArray.length}`}
                </p>
                <KeyboardArrowRight
                  className="w-5 lg:w-12 h-auto cursor-pointer hover:bg-darkHighlight dark:hover:bg-lightHighlight dark:text-lightText"
                  onClick={nextPg}
                />
                <KeyboardDoubleArrowRight
                  className="w-5 lg:w-12 h-auto cursor-pointer hover:bg-darkHighlight dark:hover:bg-lightHighlight dark:text-lightText"
                  onClick={goToLastPage}
                />
              </div>
            )}
           
          </div>
        </>
      )}
    </div>
  );
}

export default Reader;
