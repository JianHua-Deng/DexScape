import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getChapterMetaData, searchSpecificManga, fetchChapterList, getChapterInfo } from "../../utils/mangaDexApi";
import Skeleton from "react-loading-skeleton";
import { getChapterListConfig, getAvailableLanguages, filterDuplicateChapters, scrollToStart, preLoadImages } from "../../utils/utils";
import Select from "react-select";
import ChapterImage from "../chapter-image/ChapterImage";
import getSelectorStyle from "../../utils/theme";
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, KeyboardArrowLeft, KeyboardArrowRight, ArrowBack } from '@mui/icons-material';
import { useAuth } from "../../lib/AuthContext";
import { updateUserReadingHistory } from "../../utils/supabase";


function Reader() {
  
  const navigate = useNavigate();
  const { mangaID, chapterID, page } = useParams();

  const [tags, setTags] = useState([]);
  const [isWebtoon, setIsWebtoon] = useState(false);

  const [chapterList, setChapterList] = useState([]);
  const [chapterData, setChapterData] = useState([]);
  const [mangaLanguage, setMangaLanguage] = useState([]);
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [imageUrlArray, setImageUrlArray] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [imgURL, setImageURL] = useState("");
  const [pageNumber, setPageNumber] = useState(page); // Type integer version of "page"
  const [preLoadedImageIndex, setPreLoadedImageIndex] = useState(parseInt(page, 10));
  const [preLoadedImageSet, setPreloadedImageSet] = useState(new Set());

  const { theme } = useThemeProvider();
  const { session, userID } = useAuth();

  // Create a ref for the image container
  const imageContainerRef = useRef(null);

  // When pageNumber changes, scroll to the image container
  useEffect(() => {
    scrollToStart(imageContainerRef);
  }, [page, chapterID, isLoadingData]);

  // Fetch manga language info
  useEffect(() => {
    setIsLoadingData(true);
    searchSpecificManga(mangaID).then((respond) => {
      setTags(() => {
        return respond.attributes.tags.filter(tag => tag.attributes.group === 'format') ?? [];
      });
      setMangaLanguage(getAvailableLanguages(respond));
    });
  }, [mangaID, chapterID]);

  // Fetch chapter meta data
  useEffect(() => {
    setPreLoadedImageIndex(parseInt(page, 10)); // Resetting preLoadImageIndex when switching chapter
    getChapterMetaData(chapterID).then((respond) => {
      setMetaData(respond);
    });

    getChapterInfo(chapterID).then((respond) => {
      //console.log(respond);
      setChapterData(respond);
    })
  }, [chapterID]);

  // Fetch chapter list once language is available
  useEffect(() => {
    if (!mangaLanguage?.length) return;
    const paramConfig = getChapterListConfig(mangaLanguage);

    fetchChapterList(mangaID, paramConfig).then((respond) => {

      const filteredChapterList = filterDuplicateChapters(respond);
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
    });
  }, [mangaLanguage, mangaID]);

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
    if (session && chapterData && chapterData?.attributes?.chapter) {
      updateUserReadingHistory(userID, mangaID, chapterID, chapterData.attributes.chapter , page);
    }
  }, [imgURL]);

  useEffect(() => {
    //console.log(tags);
    if (tags.some(tag => tag.attributes.name.en === "Long Strip")) {
      //console.log("It is a webtoon");
      setIsWebtoon(true);
    }
  }, [tags]);


  function scrollDownOnClick(){
    const mainScrollContainer = document.querySelector(".main-scroll-container");
    if (mainScrollContainer) {
      mainScrollContainer.scrollBy({
        top: 1000,
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
    const currentIndex = chapterList.findIndex((chapter) => chapter.id === chapterID);
    const nextChapterIndex = currentIndex + 1;
    if (nextChapterIndex >= chapterList.length) {
      navigate(`/comic/${mangaID}`);
      return;
    }
    const nextChapter = chapterList[nextChapterIndex];
    navigate(`/comic/${mangaID}/chapter/${nextChapter.id}/1`);
  }

  function previousChapter() {
    const currentIndex = chapterList.findIndex((chapter) => chapter.id === chapterID);
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

    <div className="flex flex-col w-full h-full items-center gap-4">
      {isLoadingData ? (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[60rem]">
          <div className="w-full">
            <Skeleton className="w-full aspect-[3/4]" />
          </div>
        </div>
      ) : (
        <>

          <div className="flex justify-evenly w-full max-w-72 gap-4 md:grid md:grid-cols-3 md:items-center md:w-full md:max-w-full">
            <Link
              to={`/comic/${mangaID}`}
              className="self-center justify-self-start p-[0.3rem]"
            >
              <ArrowBack
                sx={{ fontSize: '2rem', ml: 2 }}
                className="dark:text-lightText hover:bg-darkHighlight dark:hover:bg-lightHighlight"
              />

            </Link>

            <div className="min-w-0 self-center justify-self-center col-start-2 col-end-3 p-[0.3rem] ">
              <Select
                isSearchable={false}
                styles={ getSelectorStyle(theme) }
                options={selectorOptions}
                value={selectorOptions.find(
                  (option) => option.value === chapterID
                )}
                onChange={(selectedOption) => {
                  navigate(
                    `/comic/${mangaID}/chapter/${selectedOption.value}/1`
                  );
                }}
              />
            </div>
          </div>

          
          <div ref={imageContainerRef} className={` ${isWebtoon ? 'h-auto items-start' : 'h-screen items-center'} flex w-full justify-center items-center ${isWebtoon? 'max-w-[60rem]' : 'max-w-full' }`}>
            
            {isWebtoon ? (
              <div className="flex flex-col w-full h-full">
                {imageUrlArray.map((url, index) => (
                  <ChapterImage imgURL={url} imgStyle={"w-full h-auto"} onClick={scrollDownOnClick} key={index}/>
                ))}
              </div>

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
