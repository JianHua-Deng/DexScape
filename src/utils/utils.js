

//If the available language is empty, return the original language, else check if there's english, if not, return the first one in that array
export function getAvailableLanguages(manga){
    if(manga.attributes.availableTranslatedLanguages.length < 1){
        return [`${manga.attributes.originalLanguage}`]
    }else{
        return manga.attributes.availableTranslatedLanguages.find(lang => lang == 'en' ) ? ['en'] : [`${manga.attributes.availableTranslatedLanguages[0]}`]
    }
}

export function filterDuplicateChapters(chapterList){
    const chapterSet = new Set();
    return chapterList.filter(chapter => {
        if(!chapterSet.has(chapter.attributes.chapter)){
            chapterSet.add(chapter.attributes.chapter);
            return chapter;
        }
    });
}

export function getChapterListConfig(mangaLanguage){
    return {
        limit: 500,
        translatedLanguage: mangaLanguage,
        includeExternalUrl: 0,
        order: {
            chapter: 'asc',
        }
    }
}

export function getMangaListConfig(mangaIDs, limit){
  return {
    limit: limit,
    includes: ["authors", "artist", "cover_art"],
    ids: mangaIDs,
  }
}

export function getTagsListID(rawTagsObject, tagsList) {
  const idList = rawTagsObject.reduce((accumulator, tagItem) => {
    if (tagsList.includes(tagItem?.attributes?.name?.en)){
      accumulator.push({id: tagItem.id, tag: tagItem?.attributes?.name?.en});
    }
    return accumulator;
  }, [])

  return idList
}

export function getMangaTitle(manga){
  return manga.attributes.title.en ? manga.attributes.title.en : Object.values(manga.attributes.title)[0];
}

export function scrollToStart(ref) {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, 10)
}

export function preLoadImages(imageUrlArray, currentPreloadIndex, offset, preLoadedImageSet, setPreloadedImageSet) {
  let currentIndex = currentPreloadIndex;
  let imageSet = new Set();

  if (imageUrlArray.length > 0) {
    const offsetIndex = currentPreloadIndex + offset;

    while ( (currentIndex < offsetIndex) && (currentIndex < imageUrlArray.length) ) {
      const imgUrl = imageUrlArray[currentIndex]
      // Only preload if this URL hasn't been preloaded yet
      if (!preLoadedImageSet.has(imgUrl)){
        const imgObject = new Image();
        imgObject.src =  imgUrl;
        imageSet.add(imgUrl)
        //console.log(`Preloading, currentIndex: ${currentIndex}`);
      }
      currentIndex += 1
    }

  }

  setPreloadedImageSet((prev) => new Set([...prev, ...imageSet]));
  return currentIndex; // Return the final index that it leftoff at
}



export const defaultSearchConfig = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    order: {
        relevance: 'desc',
        rating: 'desc',
        followedCount: 'desc',
    },
    hasAvailableChapters: 'true'
};

export const acclaimedSearchParams = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    },
    hasAvailableChapters: 'true'
}

export const latestSearchParams = {
    limit: 7,
    includes: ["authors", "artist", "cover_art"],
    order: {
        latestUploadedChapter: 'desc',
        followedCount: 'desc',
        rating: 'desc',
    },
    hasAvailableChapters: 'true'
}

export const trendSearchParams = {
  limit: 7,
  includes: ["authors", "artist", "cover_art"],
  order: {
      followedCount: 'desc',
      rating: 'desc',
      latestUploadedChapter: 'desc',
  },
  hasAvailableChapters: 'true'
}

export const completedMangaParams = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    status: ["completed"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    },
    hasAvailableChapters: 'true'
}
  

export const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    className: "min-w-0",
    arrows: false,
    autoplay: true,
    autoplaySpeed: 7000,
    
}



//export {sliderSettings, defaultSearchConfig, acclaimedSearchParams, latestSearchParams, trendSearchParams, completedMangaParams, getAvailableLanguages, getChapterListConfig, filterDuplicateChapters, scrollToStart, getTagsListID, getMangaListConfig, getMangaTitle }
