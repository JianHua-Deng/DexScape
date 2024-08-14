import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../Utils/Utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedSlider.css"
import { searchMangas } from "../../Utils/APICalls/MangaDexApi";
import MangaPreview from "../manga-preview/MangaPreview";

function FeaturedSlider({searchParams, title}){

    const [mangas, setMangas] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        setLoadingStatus(true);

        searchMangas(searchParams).then((resp) => {

            setMangas(resp);

        }).catch(e => {console.log(e)}).finally(() => {
            setLoadingStatus(false);
        });
    }, []);

    return (
        <>
            <div className="slider-container">
                <h2>{`${title}`}</h2>
                {loadingStatus && mangas.length === 0 ? (
                    <h3>Loading</h3>
                ):(
                    <Slider {...sliderSettings}>
                        {mangas.map((manga, index) => {
                            return (
                                <MangaPreview manga={manga} version={"cover"} key={index} id={manga.id}/>
                            );
                        })}
                    </Slider>
                    )
                }
            </div>
        </>
    );
}

export default FeaturedSlider;