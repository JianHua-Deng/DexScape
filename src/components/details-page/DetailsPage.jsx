import { useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation, useSearchParams } from "react-router-dom";
import { fetchChapterList, searchSpecificManga, getCoverUrl } from "../../utils/mangaDexApi";
import { getChapterListConfig, filterDuplicateChapters, scrollToStart } from "../../utils/utils";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "@mui/material";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";
import { useAuth } from "../../lib/AuthContext";
import { checkIfUserFavorited, addMangaToFavorite, removeFavorited, getMangaLatestHistory} from "../../utils/supabase";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import toast from "react-hot-toast";
import { colors } from "../../utils/colors";
import Select from "react-select";
import getSelectorStyle from "../../utils/theme";
import { useThemeProvider } from "../../lib/ThemeContextProvider";

function DetailPage() {
  const { mangaID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedLanguage = searchParams.get('lang');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [manga, setManga] = useState({});
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [chapterList, setChapterList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [readingHistory, setReadingHistory] = useState(null);

  const { pathname } = useLocation();
  const mainContentRef = useRef(null);
  const { session, userID } = useAuth();
  const { theme } = useThemeProvider();


  // Fetch user's reading history and favorite status of this manga
  useEffect(() => {
    let active = true;
    setFavorited(false);
    setReadingHistory(null);
    async function checkFavoriteStatus() {
      if (userID) {
        const isFavorited = await checkIfUserFavorited(userID, mangaID);
        if (active) setFavorited(isFavorited);
      }
    }

    async function getCurrentMangaHistory() {
      const data = await getMangaLatestHistory(userID, mangaID);
      if (active) setReadingHistory(data?.[0] ?? null);
    }
    
    if (session && userID) {
      checkFavoriteStatus();
      getCurrentMangaHistory();
    }
    return () => { active = false; };
  }, [userID, mangaID, session])


  // Scroll to the top of the page on enter
  useEffect(() => {
    scrollToStart(mainContentRef);
  }, [pathname, loadingStatus])


  // Start fetching the data on MangaID changes
  useEffect(() => {
    let active = true;
    setLoadingStatus(true);
    setLoadError('');
    setIsImageLoading(true);
    setChapterList([]);

    async function loadDetails() {
      let errorMessage = 'Could not load manga details. Please try again.';
      try {
        const resp = await searchSpecificManga(mangaID);
        if (!active) return;
        const translatedLanguages = resp.attributes.availableTranslatedLanguages ?? [];
        const nonEmptyLanguages = translatedLanguages.filter(Boolean);
        const languages = [...new Set(nonEmptyLanguages)];

        let language = '';
        if (languages.includes(requestedLanguage)) {
          language = requestedLanguage;
        } else if (languages.includes('en')) {
          language = 'en';
        } else if (languages.length > 0) {
          language = languages[0];
        }
        setAvailableLanguages(languages);
        setSelectedLanguage(language);
        const paramConfig = getChapterListConfig([language]);
        errorMessage = 'Could not load chapters. Please try again.';
        const chapters = language ? await fetchChapterList(mangaID, paramConfig) : [];
        if (!active) return;
        const filteredChapter = filterDuplicateChapters(chapters);
        setManga(resp);
        setCoverUrl(getCoverUrl(resp));
        setTags(resp.attributes.tags.filter(tag => tag.attributes.group === 'genre' || tag.attributes.group === 'theme'));
        setTitle(resp.attributes.title.en || Object.values(resp.attributes.title)[0] || 'Title Not Available');
        setChapterList(filteredChapter);
      } catch {
        if (active) setLoadError(errorMessage);
      } finally {
        if (active) setLoadingStatus(false);
      }
    }

    loadDetails();
    return () => { active = false; };
  }, [mangaID, requestedLanguage, retryCount]);

  const canContinue = Boolean(readingHistory && chapterList.some(chapter => chapter.id === readingHistory.chapter_id));
  const startReadingLink = canContinue
    ? `/comic/${mangaID}/chapter/${readingHistory.chapter_id}/${readingHistory.page}`
    : `/comic/${mangaID}/chapter/${chapterList[0]?.id}/1`;

  function languageLabel(code) {
    const specialLabels = { 'es-la': 'Spanish (Latin America)', 'ja-ro': 'Japanese (Romanized)', 'ko-ro': 'Korean (Romanized)', 'zh-ro': 'Chinese (Romanized)' };
    if (specialLabels[code]) return specialLabels[code];
    try {
      return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code;
    } catch {
      return code;
    }
  }

  const languageOptions = availableLanguages.map(code => ({
    value: code,
    label: languageLabel(code),
  }));

  useEffect(() => {
    setVolumeList(() => {
      return chapterList.reduce((acc, chapter) => {
        const volume = chapter.attributes.volume;
        if (!volume) {
          if (!acc["Uncategorized"]) {
            acc["Uncategorized"] = [];
          }
          acc["Uncategorized"].push(chapter);
          return acc;
        }
        if (!acc[volume]) {
          acc[volume] = [];
        }
        acc[volume].push(chapter);
        return acc;
      }, {});
    });
  }, [chapterList]);

  async function handleFavoriteAction() {
    try {
      if (favorited) {
        await removeFavorited(userID, mangaID);
        toast.success("Removed from Favorite");
        setFavorited(false);
      } else {
        await addMangaToFavorite(userID, mangaID, title, selectedLanguage);
        toast.success("Added to Favorite");
        setFavorited(true);
      }
    } catch (error) {
      toast.error("Error updating favorite. Please try again.");
      console.error("Error updating favorite:", error);
    }
  }

  return (
    <div className="min-h-screen">
      {loadError ? (
        <div role="alert" className="max-w-7xl mx-auto px-4 py-8 text-center text-darkText dark:text-lightText">
          <p className="mb-4">{loadError}</p>
          <button onClick={() => setRetryCount(count => count + 1)}>Try again</button>
        </div>
      ) : loadingStatus ? (
        <DetailsSkeleton />
      ) : (
        <div ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-secDarkBg rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-8">
                {/* Cover Image */}
                <div className="relative">
                  {isImageLoading && (
                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                  )}
                  <img
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
                    src={coverUrl}
                    alt="manga-cover"
                    style={{ display: isImageLoading ? "none" : "block" }}
                    onLoad={() => setIsImageLoading(false)}
                  />
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-lightText mb-4">
                    {title}
                  </h1>

                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6 line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {manga?.attributes?.description?.en || "N/A"}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          to={`/tag/${tag.attributes.name.en}/${tag.id}/1`}
                          className="px-3 py-1 bg-blue-100 dark:bg-lightDark text-blue-500 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-gray-400 transition-colors duration-200"
                        >
                          {tag.attributes.name.en}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Start Reading Button */}
                  <div className="mb-6 text-darkText dark:text-lightText">
                    <label htmlFor="chapter-language" className="block mb-2 font-medium">Chapter language</label>
                    <Select
                      inputId="chapter-language"
                      isSearchable={false}
                      styles={{
                        ...getSelectorStyle(theme),
                        menuPortal: base => ({ ...base, zIndex: 1300 }),
                      }}
                      menuPortalTarget={document.body}
                      options={languageOptions}
                      value={languageOptions.find(option => option.value === selectedLanguage) ?? null}
                      isDisabled={languageOptions.length === 0}
                      placeholder="No languages available"
                      onChange={selectedOption => {
                        if (!selectedOption) return;
                        const params = new URLSearchParams(searchParams);
                        params.set('lang', selectedOption.value);
                        setSearchParams(params);
                      }}
                      className="w-full sm:w-64"
                    />
                  </div>
                  <div className="flex flex-col items-center lg:flex-row gap-4">
                    {chapterList.length > 0 && (
                    <Link
                      to={startReadingLink}
                      className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white dark:text-gray-200 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-40 text-center font-medium"
                    >
                      {canContinue ? "Continue" : "Start Reading"}
                    </Link>
                    )}
                    <button
                      onClick={handleFavoriteAction}
                      className={`${session ? 'block' : 'hidden'} flex justify-center items-center gap-1 font-medium outline-none focus:border-none w-40`}>
                        {favorited ? (
                          <>
                            <StarIcon style={{ color: `${colors.starColor}` }}/>
                            <h3>Unfavorite</h3>
                          </>
                        ) : (
                          <>
                            <StarBorderIcon style={{ color: `${colors.starColor}` }}/> 
                            <h3>Favorite</h3>
                          </>
                          )
                        }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Section */}
          {chapterList.length > 0 ? (
            <div className="mt-8 bg-white dark:bg-secDarkBg rounded-2xl shadow-lg p-6 sm:p-8">
              {Object.entries(volumeList).map(([volume, chapters], index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-lightText mb-4">
                    {volume === "Uncategorized" ? "Chapters" : `Volume ${volume}`}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {chapters.map((chapter) => (
                      <Tooltip 
                        key={chapter.id} 
                        title={chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`} 
                        placement="top" 
                        arrow
                      >
                        <Link
                          to={`/comic/${mangaID}/chapter/${chapter.id}/1`}
                          className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {chapter.attributes.chapter || "Oneshot"}
                          </span>
                        </Link>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
              {selectedLanguage ? `No readable chapters available in ${languageLabel(selectedLanguage)}.` : 'No readable chapters available.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailPage;
