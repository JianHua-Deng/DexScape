
function getCoverUrl(manga){
    console.log(manga);
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
    }
};

const popularSearchParams = {
    limit: 15,
    includes: ["authors", "artist", "cover_art"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    }
}

const latestSearchParams = {
    limit: 15,
    includes: ["authors", "artist", "cover_art"],
    order: {
        updatedAt: 'desc'
    }
}

const completedMangaParams = {
    limit: 15,
    includes: ["authors", "artist", "cover_art"],
    status: ["completed"],
    order: {
        rating: 'desc',
        followedCount: 'desc'
    }
}


  

const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    className: "slider",
    //nextArrow: <NextArrow/>,
    //prevArrow: <PreviousArrow/>,
    
    responsive: [
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: 4,
            },
        },

        {
            breakpoint: 1100,
            settings: {
                slidesToShow: 3,
            },
        },

        {
            breakpoint: 920,
            settings: {
                slidesToShow: 2,
            },
        },

        {
            breakpoint: 860,
            settings: {
                slidesToShow: 1,
            }
        },

    ]
    
}



export {sliderSettings, defaultSearchConfig, popularSearchParams, latestSearchParams, completedMangaParams, getCoverUrl, getAvailableLanguages, getChapterListConfig}