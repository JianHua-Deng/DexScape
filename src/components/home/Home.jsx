
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams, completedMangaParams } from '../../utils/utils';

function Home() {

  return (
    
    <div className='w-full h-auto min-h-[100vh] flex flex-col'>
      <div className='w-full'>
        <FeaturedSlider searchParams={latestS} title={"Popular Mangas"} amount={3}/>
      </div>
    

      

    </div>
  )
}

export default Home

/*
      <FeaturedSlider searchParams={completedMangaParams} title={"Completed Mangas"} amount={6}/>

      <FeaturedSlider searchParams={latestSearchParams} title={"Recently Updated"} amount={6}/>
*/