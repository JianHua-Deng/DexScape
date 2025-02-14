import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../utils/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchMangas } from "../../utils/mangaDexApi";
import { useRef } from "react";
import MangaItem from "../manga-item/MangaItem";
import MangaPreviewSkeleton from "../skeletons/result-skeleton/MangaPreviewSkeleton";
import SliderItem from "../slider-item/SliderItem";

function FeaturedSlider({searchParams, title, amount}){

    const [mangas, setMangas] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

    let sliderRef = useRef(null);

    useEffect(() => {
        setLoadingStatus(true);

        searchMangas(searchParams).then((resp) => {

            setMangas(resp.data);

        }).catch(e => {console.log(e)}).finally(() => {
            setLoadingStatus(false);
        });
    }, []);

    const previous = () => {
        sliderRef.slickPrev();
    }

    const next = () => {
        sliderRef.slickNext();
    }

    const settings = {
        ...sliderSettings,
        dots: true,
        customPaging: (i) => (
          <div className="w-2 h-2 bg-gray-300 rounded-md"></div>
        ),
        dotsClass: "slick-dots custom-dots",
    };

    

    return (
        <>
            <div className="slider-container">
                {loadingStatus && mangas.length === 0 ? (
                    <div className="slider-skeletons"><MangaPreviewSkeleton amount={6} /></div>
                ):(
                    <Slider 
                        ref={slide => sliderRef = slide}
                        {...settings}
                    >
                        {mangas.map((manga, index) => {
                            return (
                                <SliderItem manga={manga} nextSlide={next} prevSlide={previous} key={index} id={manga.id}/>

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