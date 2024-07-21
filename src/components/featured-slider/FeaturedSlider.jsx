import { useState } from "react";
import { useEffect } from "react";
import sliderSettings from "../../Utils/Utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedSlider.css"
import MangaPreview from "../manga-preview/MangaPreview";

function FeaturedSlider({fetchFunctions, title, itemLimits}){

    const [mangas, setMangas] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        setLoadingStatus(true);

        fetchFunctions(itemLimits).then((resp) => {

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

export default FeaturedSlider;