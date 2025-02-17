import { useState } from "react";
import { useEffect } from "react";
import { sliderSettings } from "../../utils/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { searchMangas } from "../../utils/mangaDexApi";
import { useRef } from "react";
import MangaPreviewSkeleton from "../skeletons/result-skeleton/MangaPreviewSkeleton";
import SliderItem from "../slider-item/SliderItem";
import Skeleton from "react-loading-skeleton";

function FeaturedSlider({searchParams}){

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
        appendDots: (dots) => (
            <div style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              height: "3rem",
              marginBottom: "1.5rem"
              }}>
              <ArrowBackIcon onClick={previous} className="text-white text-3xl cursor-pointer" />
              <ul style={{ margin: "0px" }}> {dots} </ul>
              <ArrowForwardIcon onClick={next} className="text-white text-3xl cursor-pointer" />
            </div>
          ),
    };

    

    return (
        <>
            <div className="slider-container">
                {loadingStatus && mangas.length === 0 ? (
                    <div className="slider-skeletons"><Skeleton className="w-full h-[35rem]"/></div>
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