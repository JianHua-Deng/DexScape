import { css } from "@emotion/react";

//If the available language is empty, return the original language, else check if there's english, if not, return the first one in that array
function getAvailableLanguages(manga){
    if(manga.attributes.availableTranslatedLanguages.length < 1){
        return [`${manga.attributes.originalLanguage}`]
    }else{
        return manga.attributes.availableTranslatedLanguages.find(lang => lang == 'en' ) ? ['en'] : [`${manga.attributes.availableTranslatedLanguages[0]}`]
    }
}

function filterDuplicateChapters(chapterList){
    const chapterSet = new Set();
    return chapterList.filter(chapter => {
        if(!chapterSet.has(chapter.attributes.chapter)){
            chapterSet.add(chapter.attributes.chapter);
            return chapter;
        }
    });
}

function getChapterListConfig(mangaLanguage){
    return {
        limit: 500,
        translatedLanguage: mangaLanguage,
        includeExternalUrl: 0,
        order: {
            chapter: 'asc',
        }
    }
}

function getMangaListConfig(mangaIDs, limit){
  return {
    limit: limit,
    includes: ["authors", "artist", "cover_art"],
    ids: mangaIDs,
  }
}

function getTagsListID(rawTagsObject, tagsList) {
  const idList = rawTagsObject.reduce((accumulator, tagItem) => {
    if (tagsList.includes(tagItem?.attributes?.name?.en)){
      accumulator.push({id: tagItem.id, tag: tagItem?.attributes?.name?.en});
    }
    return accumulator;
  }, [])

  return idList
}

function getMangaTitle(manga){
  return manga.attributes.title.en ? manga.attributes.title.en : Object.values(manga.attributes.title)[0];
}

function scrollToStart(ref) {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, 10)
}



const defaultSearchConfig = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    order: {
        relevance: 'desc',
        rating: 'desc',
        followedCount: 'desc',
    },
    hasAvailableChapters: 'true'
};

const popularSearchParams = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    },
    hasAvailableChapters: 'true'
}

const latestSearchParams = {
    limit: 7,
    includes: ["authors", "artist", "cover_art"],
    order: {
        latestUploadedChapter: 'desc',
        followedCount: 'desc',
        rating: 'desc',
    },
    hasAvailableChapters: 'true'
}

const completedMangaParams = {
    limit: 28,
    includes: ["authors", "artist", "cover_art"],
    status: ["completed"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    },
    hasAvailableChapters: 'true'
}
  

const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    className: "min-w-0",
    arrows: false,
    autoplay: true,
    autoplaySpeed: 7000,
    
}



export {sliderSettings, defaultSearchConfig, popularSearchParams, latestSearchParams, completedMangaParams, getAvailableLanguages, getChapterListConfig, filterDuplicateChapters, scrollToStart, getTagsListID, getMangaListConfig, getMangaTitle }
