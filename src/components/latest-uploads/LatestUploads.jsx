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
        dots: true,
        infinite: false,
        slidesToShow: 5,
        className: "latest-slider",
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
                                <MangaPreview manga={manga} index={index}/>
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