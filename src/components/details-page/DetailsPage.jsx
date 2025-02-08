import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchChapterList, searchSpecificManga } from "../../utils/mangaDexApi";
import { getCoverUrl, getAvailableLanguages, getChapterListConfig, filterDuplicateChapters } from "../../utils/utils";
import Tooltip from "../tooltip/Tooltip";
import DetailsSkeleton from "../skeletons/details-skeleton/DetailsSkeleton";
// Removed: import './DetailsPage.css'

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

  // Group chapters by volume
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
      <div
        className="manga-details-container
                   max-[340px]:flex max-[340px]:flex-col max-[340px]:justify-center max-[340px]:items-center"
      >
        {loadingStatus ? (
          <DetailsSkeleton />
        ) : (
          <>
            <div
              className="details-container
                         h-fit grid grid-rows-[auto,2.5rem] grid-cols-[1fr,3fr]
                         gap-8 mb-12 rounded-xl p-20 bg-[var(--primary-color)]
                         max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:justify-center max-[1024px]:items-center max-[1024px]:p-4"
            >
              <img
                className="w-[25rem] h-auto row-span-2 justify-self-center rounded-2xl
                           max-[340px]:w-[15rem] max-[768px]:w-[17rem]"
                src={coverUrl}
                alt="manga-cover"
              />
              <div
                className="details flex flex-col flex-wrap justify-center items-center
                           lg:justify-start lg:items-start"
              >
                <h1 className="text-left max-[768px]:text-center">
                  {manga?.attributes?.title?.en ||
                    (manga?.attributes?.title["ja-ro"] &&
                      Object.values(manga.attributes.title)[0]) ||
                    "Title Not Available"}
                </h1>
                <div className="manga-descriptions">
                  <p className="text-left max-[768px]:text-center">
                    {`${manga?.attributes?.description?.en || "N/A"}`}
                  </p>
                </div>
                {tags.length < 1 ? (
                  <></>
                ) : (
                  <div
                    className="tags-container flex flex-wrap justify-center items-start mt-5 gap-2 max-w-[25rem] md:gap-4 md:max-w-[64rem]"
                  >
                    {tags.map((tag, index) => (
                      <Link
                        className="max-w-[10rem] h-auto p-[0.6rem] text-white bg-[var(--button-color)]
                                   rounded-[0.6rem] cursor-pointer hover:text-[var(--highlight-color)]"
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
                className="start-reading-button text-white rounded-2xl self-center flex justify-center items-center
                           w-[15rem] h-[3.5rem] mt-12 bg-[var(--button-color)]
                           max-[1024px]:mt-0"
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
                <div
                  className="chapter-list grid bg-[var(--primary-color)] rounded-[2rem] p-6 gap-8"
                >
                  {Object.entries(volumeList).map(([volume, chapters], index) => (
                    <div
                      className="volume-chapter-container flex flex-col max-[768px]:items-center"
                      key={index}
                    >
                      <div className="volume-chapter-title">
                        {volume === "Uncategorized" ? (
                          <h2 className="text-left max-[768px]:text-center">Chapters</h2>
                        ) : (
                          <h2 className="text-left max-[768px]:text-center">{`Volume ${volume}`}</h2>
                        )}
                      </div>
                      <div
                        className="chapters-container flex flex-wrap gap-4
                                   max-[768px]:justify-center max-[768px]:items-center"
                      >
                        {chapters.map((chapter, index) => (
                          <Tooltip key={index} content={chapter.attributes.title} direction="top">
                            <Link
                              className="chapter bg-[var(--button-color)] text-[var(--primary-color)] flex justify-center items-center
                                         rounded-2xl w-[7rem] max-w-[13rem] h-[3rem] cursor-pointer hover:text-[var(--highlight-color)]"
                              id={chapter.id}
                              to={`/comic/${mangaID}/chapter/${chapter.id}/1`}
                            >
                              <p className="chapter-container flex justify-center items-center w-full">
                                <span className="chapter-number whitespace-nowrap mr-[0.2rem]">
                                  {`${chapter.attributes.chapter || "Oneshot"}`}
                                </span>
                                {/*
                                  If you later want to show the chapter title, you can add:
                                  <span className="chapter-title truncate max-w-[50%]">
                                    {chapter.attributes.title ? `- ${chapter.attributes.title}` : ""}
                                  </span>
                                */}
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
