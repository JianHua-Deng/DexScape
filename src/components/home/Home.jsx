import { useState } from 'react'
import LatestUploads from '../latest-uploads/LatestUploads';
import PopularUploads from '../popular-uploads/PopularUploads';

//import '../App.css'
import './Home.css'

function Home() {

  //searchLatestUpload();

  return (
    <>
      <LatestUploads/>
      <PopularUploads/>
    </>
  )
}

export default Home