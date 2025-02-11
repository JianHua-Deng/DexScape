
function getCoverUrl(manga){
    //console.log(manga);
    const baseUrl =  `${process.env.PROXY_URL}`;
    //const baseUrl = "http://localhost:5173"
    const params = `${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`;
    const coverUrl = `${baseUrl}/covers/${params}`;
    
    //console.log(coverUrl);
    return coverUrl;
}


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
    limit: 21,
    includes: ["authors", "artist", "cover_art"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    },
    hasAvailableChapters: 'true'
}

const latestSearchParams = {
    limit: 21,
    includes: ["authors", "artist", "cover_art"],
    order: {
        updatedAt: 'desc',
    },
    hasAvailableChapters: 'true'
}

const completedMangaParams = {
    limit: 21,
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
    infinite: false,
    slidesToShow: 5,
    className: "min-w-0",
    
    responsive: [

        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 5,
            },
        },

        {
            breakpoint: 1800,
            settings: {
                slidesToShow: 4,
            },
        },

        {
            breakpoint: 1320,
            settings: {
                slidesToShow: 3,
            },
        },

        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
            },
        },

        {
            breakpoint: 920,
            settings: {
                slidesToShow: 1,
            },
        },


    ]
    
}



export {sliderSettings, defaultSearchConfig, popularSearchParams, latestSearchParams, completedMangaParams, getCoverUrl, getAvailableLanguages, getChapterListConfig, filterDuplicateChapters}
