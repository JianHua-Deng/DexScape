import { useState } from 'react'
import { searchMangas, searchLatestUploads, searchPopularUploads } from '../../Utils/APICalls/MangaDexApi';
import FeaturedSlider from '../featured-slider/FeaturedSlider';

//import '../App.css'
import './Home.css'

function Home() {

  //searchLatestUpload();

  return (
    <>
      <FeaturedSlider fetchFunctions={searchPopularUploads} title={"Popular Mangas"} itemLimits={15}/>
      <FeaturedSlider fetchFunctions={searchLatestUploads} title={"Latest Uploads"} itemLimits={15}/>
    </>
  )
}

export default Home