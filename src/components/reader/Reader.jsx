import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getChapterMetaData, searchSpecificManga, fetchChapterList } from "../../utils/mangaDexApi";
import Skeleton from "react-loading-skeleton";
import { getChapterListConfig, getAvailableLanguages, filterDuplicateChapters } from "../../utils/utils";
import Select from "react-select";

function Reader() {
  const navigate = useNavigate();
  const { mangaID, chapterID, page } = useParams();

  const [manga, setManga] = useState(null);
  const [tags, setTags] = useState([]);
  const [isWebtoon, setIsWebtoon] = useState(false);

  const [chapterList, setChapterList] = useState([]);
  const [mangaLanguage, setMangaLanguage] = useState([]);
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [imageUrlArray, setImageUrlArray] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [imgURL, setImageURL] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(page);

  // Create a ref for the image container
  const imageContainerRef = useRef(null);

  // When pageNumber changes, scroll to the image container
  useEffect(() => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pageNumber]);

  // Fetch manga language info
  useEffect(() => {
    setIsLoadingData(true);
    setIsImageLoading(true);
    searchSpecificManga(mangaID).then((respond) => {
      setManga(respond);
      setTags(() => {
        return respond.attributes.tags.filter(tag => tag.attributes.group === 'format') ?? [];
      });
      setMangaLanguage(getAvailableLanguages(respond));
    });
  }, [mangaID, chapterID]);

  // Fetch chapter meta data
  useEffect(() => {
    getChapterMetaData(chapterID).then((respond) => {
      setMetaData(respond);
    });
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
      setImageURL(imageUrlArray[validPage - 1]);
      setIsLoadingData(false);
    }
  }, [page, imageUrlArray]);

  useEffect(() => {
    console.log(tags);
    if (tags.some(tag => tag.attributes.name.en === "Web Comic")) {
      console.log("It is a webtoon");
      setIsWebtoon(true);
    }
  }, [tags]);

  // Navigation functions update the URL
  function nextPg() {
    setIsImageLoading(true);
    if (pageNumber === imageUrlArray.length) {
      nextChapter();
      return;
    }
    navigate(`/comic/${mangaID}/chapter/${chapterID}/${pageNumber + 1}`);
  }

  function previousPg() {
    setIsImageLoading(true);
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
    // .image-display-container → flex column, full height, centered, gap ~1.5rem
    <div className="flex flex-col h-full items-center gap-4 w-full">
      {isLoadingData ? (
        // .image-display-skeleton-container → full width/height, flex-col, centered, max width 60rem
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[60rem]">
          {/* .image-skeleton → full width */}
          <div className="w-full">
            {/* .custom-skeleton → full width with 3:4 aspect ratio */}
            <Skeleton className="w-full aspect-[3/4]" />
          </div>
        </div>
      ) : (
        <>
          {/* .reader-options → on mobile: flex with even spacing, fixed width; on md+ switch to grid */}
          <div className="flex justify-evenly w-[25rem] gap-4 md:grid md:grid-cols-3 md:items-center md:w-full">
            {/* .return-logo: grid column 1, left aligned with small padding */}
            <Link
              to={`/comic/${mangaID}`}
              className="self-center justify-self-start p-[0.3rem]"
            >
              <img
                src="/return-button.svg"
                alt="return"
                className="w-6 lg:w-12 h-auto"
              />
            </Link>
            {/* .chapter-selector: grid column 2, left aligned with small padding */}
            <div className="self-center justify-self-center col-start-2 col-end-3 p-[0.3rem]">
              <Select
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

          {/* .chapter-image-container → flex, full width/height, centered, max width 60rem */}
          <div ref={imageContainerRef} className={` ${isWebtoon ? 'h-auto' : 'h-screen'} flex w-full justify-center items-center max-w-[60rem]`}>
            {isImageLoading && (
              <div className="w-full">
                <Skeleton className="w-full aspect-[5/6]" />
              </div>
            )}
            {/* .chapter-image → responsive widths: using approximate breakpoints */}
            <img
              src={imgURL}
              onLoad={() => {
                setIsImageLoading(false);
              }}
              style={{ display: isImageLoading ? "none" : "block" }}
              alt="manga-content"
              className={ isWebtoon ? 'w-full h-auto' : "h-screen w-auto object-contain cursor-pointer"}
              onClick={nextPg}
            />
          </div>

          {/* .control-buttons-container → flex container with fixed width (responsive) */}
          <div className="flex justify-center w-[20rem] lg:w-[30rem]">
            {/* .control-buttons → full width, padded, spaced evenly */}
            <div className="w-full p-4 gap-4 lg:gap-8 flex justify-evenly items-center">
              <img
                src="/previous-to-start.svg"
                alt="to-start"
                className="w-5 lg:w-12 h-auto cursor-pointer"
                onClick={goToFirstPage}
              />
              <img
                src="/previous-page.svg"
                alt="previous"
                className="w-5 lg:w-12 h-auto cursor-pointer"
                onClick={previousPg}
              />
              <p className="text-sm lg:text-2xl">
                {`${pageNumber}/${imageUrlArray.length}`}
              </p>
              <img
                src="/next-page.svg"
                alt="next"
                className="w-5 lg:w-12 h-auto cursor-pointer"
                onClick={nextPg}
              />
              <img
                src="/next-to-last.svg"
                alt="to-last"
                className="w-5 lg:w-12 h-auto cursor-pointer"
                onClick={goToLastPage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reader;
