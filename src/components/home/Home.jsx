
import FeaturedSlider from '../featured-slider/FeaturedSlider';
import { popularSearchParams, latestSearchParams, completedMangaParams } from '../../utils/utils';
import './Home.css'

function Home() {

  return (
    <>
    <div>
      <FeaturedSlider searchParams={popularSearchParams} title={"Popular Mangas"}/>
    </div>
      <FeaturedSlider searchParams={completedMangaParams} title={"Completed Mangas"}/>
    <div>

    </div>
      <FeaturedSlider searchParams={latestSearchParams} title={"Recently Updated"}/>
    <div>
    
    </div>
    </>
  )
}

export default Home