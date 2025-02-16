
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams, completedMangaParams } from '../../utils/utils';

function Home() {

  return (
    
    <div className='w-full h-auto min-h-[100vh] flex flex-col'>
      <div className='w-full'>
        <FeaturedSlider searchParams={latestSearchParams}/>
      </div>
    
      <div className='bg-white '>

      </div>

    </div>
  )
}

export default Home

/*
      <FeaturedSlider searchParams={completedMangaParams} title={"Completed Mangas"} amount={6}/>

      <FeaturedSlider searchParams={latestSearchParams} title={"Recently Updated"} amount={6}/>
*/