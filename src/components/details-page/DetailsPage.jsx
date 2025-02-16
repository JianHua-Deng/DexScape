import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchChapterList, searchSpecificManga, getCoverUrl } from "../../utils/mangaDexApi";
import { getAvailableLanguages, getChapterListConfig, filterDuplicateChapters } from "../../utils/utils";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "@mui/material";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";

function DetailPage() {
  const { mangaID } = useParams();
  const [manga, setManga] = useState({});
  const [coverUrl, setCoverUrl] = useState('');
  const [mangaLanguage, setMangaLanguage] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tags, setTags] = useState([]);

  const mainContentRef = useRef(null)

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [loadingStatus])


  useEffect(() => {

    console.log("Fetching Manga Data");
    searchSpecificManga(mangaID).then(resp => {
      setManga(resp);
      setCoverUrl(getCoverUrl(resp));
      setMangaLanguage(getAvailableLanguages(resp));
    });
  }, [mangaID]);

  useEffect(() => {
    if (!manga?.attributes || !mangaLanguage?.length) return;
    const paramConfig = getChapterListConfig(mangaLanguage);
    setTags(() => {
      return manga.attributes.tags.filter(tag => tag.attributes.group === 'genre') ?? [];
    });
    fetchChapterList(mangaID, paramConfig)
      .then(respond => {
        const filteredChapter = filterDuplicateChapters(respond);
        setChapterList(filteredChapter);
      })
      .finally(() => {
        setLoadingStatus(false);
      });
  }, [manga, mangaLanguage, mangaID]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {loadingStatus ? (
        <DetailsSkeleton />
      ) : (
        <div ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {manga?.attributes?.title?.en ||
                      (manga?.attributes?.title["ja-ro"] &&
                        Object.values(manga.attributes.title)[0]) ||
                      "Title Not Available"}
                  </h1>

                  <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {manga?.attributes?.description?.en || "N/A"}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          to={`/tag/${tag.attributes.name.en}/${tag.id}/1`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                        >
                          {tag.attributes.name.en}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Start Reading Button */}
                  <Link
                    to={chapterList.length > 0 
                      ? `/comic/${mangaID}/chapter/${chapterList[0].id}/1`
                      : `/comic/${mangaID}`}
                    className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-40 text-center font-medium"
                  >
                    Start Reading
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Section */}
          {chapterList.length > 0 ? (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {Object.entries(volumeList).map(([volume, chapters], index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
                          className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                          <span className="font-medium text-gray-700">
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
            <div className="mt-8 text-center text-gray-600">
              No chapters available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailPage;