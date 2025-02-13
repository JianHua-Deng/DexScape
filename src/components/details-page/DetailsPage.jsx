import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchChapterList, searchSpecificManga } from "../../utils/mangaDexApi";
import { getAvailableLanguages, getChapterListConfig, filterDuplicateChapters } from "../../utils/utils";
import { getCoverUrl } from "../../utils/mangaDexApi";
import Tooltip from "../tooltip/Tooltip";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";

function DetailPage() {
  const { mangaID } = useParams();

  const [manga, setManga] = useState({});
  const [coverUrl, setCoverUrl] = useState('');
  const [mangaLanguage, setMangaLanguage] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setLoadingStatus(true);
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
    <>
      <div className="manga-details-container sm:block flex flex-col justify-center items-center">
        {loadingStatus ? (
          <DetailsSkeleton />
        ) : (
          <>
            <div className="details-container h-fit flex flex-col lg:grid lg:grid-rows-[auto,2.5rem] lg:grid-cols-[1fr,2fr] gap-8 mb-12 rounded-xl p-4 md:p-8 lg:p-20 bg-[var(--primary-color)] items-center">
              <img
                className="w-55 sm:w-64 md:w-80 lg:w-96 h-auto row-span-2 justify-self-center rounded-2xl"
                src={coverUrl}
                alt="manga-cover"
              />
              <div className="details flex flex-col flex-wrap justify-center items-center lg:items-start">
                <h1 className="text-center lg:text-left">
                  {manga?.attributes?.title?.en ||
                    (manga?.attributes?.title["ja-ro"] &&
                      Object.values(manga.attributes.title)[0]) ||
                    "Title Not Available"}
                </h1>
                <div className="manga-descriptions mt-4">
                  <p className="text-center lg:text-left">
                    {`${manga?.attributes?.description?.en || "N/A"}`}
                  </p>
                </div>
                {tags.length < 1 ? (
                  <></>
                ) : (
                  <div className="tags-container flex flex-wrap justify-center items-start mt-5 gap-2 w-full sm:w-96 md:w-full lg:justify-start">
                    {tags.map((tag, index) => (
                      <Link
                        className="w-26 p-2 text-white bg-[var(--button-color)] rounded-lg cursor-pointer hover:text-[var(--highlight-color)] text-center"
                        target="_blank"
                        rel="noopener noreferrer"
                        key={tag.id}
                        id={`tag-${index}`}
                        to={{ pathname: `/tag/${tag.attributes.name.en}/${tag.id}/1` }}
                      >
                        {`${tag.attributes.name.en}`}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                className="start-reading-button text-white rounded-2xl self-center flex justify-center items-center w-48 h-14 mt-4 lg:mt-12 bg-[var(--button-color)]"
                rel="noopener noreferrer"
                to={{
                  pathname:
                    chapterList.length > 0
                      ? `/comic/${mangaID}/chapter/${chapterList[0].id}/1`
                      : `/comic/${mangaID}`,
                }}
              >
                Start Reading
              </Link>
            </div>
            {chapterList.length < 1 ? (
              <p>No Chapter is Available</p>
            ) : (
              <div className="data-container">
                <div className="chapter-list grid bg-[var(--primary-color)] rounded-3xl p-4 md:p-6 gap-6 md:gap-8">
                  {Object.entries(volumeList).map(([volume, chapters], index) => (
                    <div
                      className="volume-chapter-container flex flex-col items-center lg:items-start"
                      key={index}
                    >
                      <div className="volume-chapter-title">
                        {volume === "Uncategorized" ? (
                          <h2 className="text-center lg:text-left">Chapters</h2>
                        ) : (
                          <h2 className="text-center lg:text-left">{`Volume ${volume}`}</h2>
                        )}
                      </div>
                      <div className="chapters-container flex flex-wrap justify-center lg:justify-start gap-4">
                        {chapters.map((chapter, index) => (
                          <Tooltip key={index} content={chapter.attributes.title} direction="top">
                            <Link
                              className="chapter bg-[var(--button-color)] text-[var(--primary-color)] flex justify-center items-center rounded-2xl w-28 h-12 cursor-pointer hover:text-[var(--highlight-color)]"
                              id={chapter.id}
                              to={`/comic/${mangaID}/chapter/${chapter.id}/1`}
                            >
                              <p className="chapter-container flex justify-center items-center w-full">
                                <span className="chapter-number whitespace-nowrap mr-1">
                                  {`${chapter.attributes.chapter || "Oneshot"}`}
                                </span>
                              </p>
                            </Link>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DetailPage;