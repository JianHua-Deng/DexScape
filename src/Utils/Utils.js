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

export default sliderSettings