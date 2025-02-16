import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams } from '../../utils/utils';
import { searchMangas, getCoverUrl } from '../../utils/mangaDexApi';
import Skeleton from 'react-loading-skeleton';
import MangaCard from '../manga-card/MangaCard';
import SectionTitle from '../ui/SectionTitle';


export default function Home() {
  const [popularManga, setPopularManga] = useState([]);
  const [latestManga, setLatestManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      setIsLoading(true);
      try {
        const popularResp = await searchMangas({ ...popularSearchParams, limit: 6 });
        const latestResp = await searchMangas({ ...latestSearchParams, limit: 6 });
        setPopularManga(popularResp.data);
        setLatestManga(latestResp.data);
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManga();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">

      <section className="w-full">
        <FeaturedSlider searchParams={latestSearchParams} />
      </section>


      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        <section>
          <SectionTitle title="Popularly Acclaimed Manga" viewAllLink="/popular/1" />
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
          <SectionTitle title="Latest Updates" viewAllLink="/latest/1" />
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Action', 'Romance', 'Comedy', 'Fantasy', 'Drama', 'Adventure'].map((genre) => (
              <Link
                key={genre}
                to={`/tag/${genre.toLowerCase()}/1`}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-gray-800 font-medium">{genre}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}