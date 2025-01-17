import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../Utils/Utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedSlider.css"
import { searchMangas } from "../../Utils/APICalls/MangaDexApi";
import MangaPreview from "../manga-preview/MangaPreview";
import MangaPreviewSkeleton from "../skeletons/result-skeleton/MangaPreviewSkeleton";

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

    const PreviousArrow = ({ className, style, onClick }) => (
        <img src="/previous-page.svg" alt="previous" style={{...style}} onClick={onClick} className={className}/>
    
      );
    
    const NextArrow = ({ className, style, onClick }) => (
        <img src="/next-page.svg" alt="next" style={{...style}} onClick={onClick} className={className}/>
      );

    const settings = {
        ...sliderSettings,
        nextArrow: <NextArrow />,
        prevArrow: <PreviousArrow />
    };

    

    return (
        <>
            <div className="slider-container">
                <h2>{`${title}`}</h2>
                {loadingStatus && mangas.length === 0 ? (
                    <div className="slider-skeletons"><MangaPreviewSkeleton amount={6} type={"featured"} /></div>
                ):(
                    <Slider {...settings}>
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