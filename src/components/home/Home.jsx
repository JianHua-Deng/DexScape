import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams, scrollToStart, getTagsListID } from '../../utils/utils';
import { searchMangas, getCoverUrl, getAllTags } from '../../utils/mangaDexApi';
import Skeleton from 'react-loading-skeleton';
import MangaCard from '../manga-card/MangaCard';
import SectionTitle from '../ui/SectionTitle';


export default function Home() {
  const [popularManga, setPopularManga] = useState([]);
  const [latestManga, setLatestManga] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [tagIdMap, setTagIdMap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tagShowcaseList = ['Action', 'Romance', 'Comedy', 'Fantasy', 'Drama', 'Adventure'];

  const mainContentRef = useRef();

  useEffect(() => {
    const fetchManga = async () => {
      setIsLoading(true);
      try {
        const popularResp = await searchMangas({ ...popularSearchParams, limit: 6 });
        const latestResp = await searchMangas({ ...latestSearchParams, limit: 6 });
        const tagResp = await getAllTags();
        
        setPopularManga(popularResp.data);
        setLatestManga(latestResp.data);
        setTagsList(tagResp);

      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManga();
    scrollToStart(mainContentRef);
  }, []);

  useEffect(() => {
    const tagsID_list = getTagsListID(tagsList, tagShowcaseList);
    setTagIdMap(tagsID_list);
  }, [tagsList])

  return (
    <div className="w-full min-h-screen">

      <section className="w-full">
        <FeaturedSlider searchParams={latestSearchParams} />
      </section>


      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        <section>
          <SectionTitle title="Popularly Acclaimed" viewAllLink="/popular/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? 
                Array(6).fill(0).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </div>
                )) : popularManga.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
          </div>
        </section>


        <section>
          <SectionTitle title="Latest Uploads" viewAllLink="/latest/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading? 
                Array(6).fill(0).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </div>
                ))
              : latestManga.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
          </div>
        </section>


        <section>
          <h2 className="text-2xl font-bold text-darkText dark:text-lightText mb-6">Popular Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tagIdMap.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.tag}/${tag.id}/1`}
                className="bg-white dark:bg-darkBlue rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-darkText dark:text-lightText font-medium">{tag.tag}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}