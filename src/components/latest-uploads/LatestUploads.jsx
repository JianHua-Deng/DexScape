import { useState } from "react";
import { useEffect } from "react";
import { searchLatestUploads } from "../../Utils/APICalls/MangaDexApi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LatestUploads.css"
import MangaPreview from "../manga-preview/MangaPreview";

function LatestUploads(){

    const [latestMangas, setLatestManga] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    var settings = {
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

    useEffect(() => {
        setLoadingStatus(true);

        searchLatestUploads().then((resp) => {

            setLatestManga(resp);

        }).catch(e => {console.log(e)}).finally(() => {
            setLoadingStatus(false);
            console.log("Length: " + latestMangas.length);
        });
    }, []);

    return (
        <>
            <div className="latest-uploads-container">
                <h2>Latest Uploads</h2>
                {loadingStatus && latestMangas.length === 0 ? (
                    <h3>Loading</h3>
                ):(
                    <Slider {...settings}>
                        {latestMangas.map((manga, index) => {
                            return (
                                <MangaPreview manga={manga} key={index}/>
                            );
                        })}
                    </Slider>
                    )
                }
            </div>
        </>
    );
}

export default LatestUploads;