import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../Utils/Utils";
import nextSlide from '../../assets/chevron-small-right-svgrepo-com.svg'
import previousSlide from '../../assets/chevron-small-left-svgrepo-com.svg'
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
        <img src={previousSlide} alt="" style={{...style}} onClick={onClick} className={className}/>
    
      );
    
    const NextArrow = ({ className, style, onClick }) => (
        <img src={nextSlide} alt="" style={{...style}} onClick={onClick} className={className}/>
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
                    <MangaPreviewSkeleton amount={5} type={"featured"} />
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