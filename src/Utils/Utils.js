

function getCoverUrl(manga){

    const baseUrl = process.env.PROXY_URL || 'http://localhost:5000';//if its local it will be set to whatever the local url is, if its deployed, it should be the domain of railway
    const params = `${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`;
    const coverUrl = `${baseUrl}/covers/${params}`;
    
    console.log(coverUrl);

    return coverUrl;
}

const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    className: "latest-slider",
    
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



export {sliderSettings, getCoverUrl}