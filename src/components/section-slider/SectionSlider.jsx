import SectionTitle from "../ui/SectionTitle"
import Skeleton from "react-loading-skeleton"
import MangaCard from "../manga-card/MangaCard"

export default function SectionSlider({ sectionTitle, navLink, mangaData, isLoading}) {


  return (
    <section>
      <SectionTitle title={sectionTitle} viewAllLink={navLink} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading? 
            Array(6).fill(0).map((_, index) => (
              <div key={index}>
                <Skeleton className="w-full h-64 rounded-lg" />
              </div>
            ))
          : mangaData.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
      </div>
    </section>
  )
}