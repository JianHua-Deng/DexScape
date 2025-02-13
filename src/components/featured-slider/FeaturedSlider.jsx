import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../utils/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchMangas } from "../../utils/mangaDexApi";
import MangaItem from "../manga-item/MangaItem";
import MangaPreviewSkeleton from "../skeletons/result-skeleton/MangaPreviewSkeleton";
import SliderItem from "../slider-item/SliderItem";

function FeaturedSlider({searchParams, title, amount}){

    const [mangas, setMangas] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        setLoadingStatus(true);

        searchMangas(searchParams).then((resp) => {

            setMangas(resp.data);

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
                {loadingStatus && mangas.length === 0 ? (
                    <div className="slider-skeletons"><MangaPreviewSkeleton amount={6} /></div>
                ):(
                    <Slider {...settings}>
                        {mangas.map((manga, index) => {
                            return (
                                <SliderItem manga={manga} key={index} id={manga.id}/>

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