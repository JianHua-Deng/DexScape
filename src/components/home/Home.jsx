import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { acclaimedSearchParams, latestSearchParams, trendSearchParams, scrollToStart, getTagsListID } from '../../utils/utils';
import { searchMangas, getAllTags } from '../../utils/mangaDexApi';
import SectionSlider from '../section-slider/SectionSlider';


export default function Home() {
  const [acclaimedMangas, setAcclaimedMangas] = useState([]);
  const [trendMangas, setTrendMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [tagIdMap, setTagIdMap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tagShowcaseList = ['Action', 'Romance', 'Comedy', 'Fantasy', 'Drama', 'Adventure'];

  const mainContentRef = useRef();

  useEffect(() => {
    const fetchManga = async () => {
      setIsLoading(true);
      try {
        const acclaimedResp = await searchMangas({ ...acclaimedSearchParams, limit: 6 });
        const trendResp = await searchMangas({...trendSearchParams, limit: 6});
        const latestResp = await searchMangas({ ...latestSearchParams, limit: 6 });
        const tagResp = await getAllTags();
        
        setAcclaimedMangas(acclaimedResp.data);
        setTrendMangas(trendResp.data);
        setLatestMangas(latestResp.data);
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

        <SectionSlider sectionTitle={`Popularly Acclaimed`} navLink={`/acclaimed/1`} mangaData={acclaimedMangas} isLoading={isLoading}/>
        <SectionSlider sectionTitle={`Trending`} navLink={`/trend/1`} mangaData={trendMangas} isLoading={isLoading}/>
        <SectionSlider sectionTitle={`Latest Uploads`} navLink={`/latest/1`} mangaData={latestMangas} isLoading={isLoading}/>


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