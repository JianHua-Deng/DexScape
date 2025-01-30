import { useState } from 'react'
import { searchMangas } from '../../Utils/mangaDexApi';
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams, completedMangaParams } from '../../Utils/utils';

//import '../App.css'
import './Home.css'

function Home() {





  return (
    <>
      <FeaturedSlider searchParams={popularSearchParams} title={"Popular Mangas"}/>
      <FeaturedSlider searchParams={completedMangaParams} title={"Completed Mangas"}/>
      <FeaturedSlider searchParams={latestSearchParams} title={"Recently Updated"}/>
    </>
  )
}

export default Home