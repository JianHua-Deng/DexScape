import { useEffect, useState } from "react";

export default function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    function handleWindowResize(){
        setWindowWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);

        // Clean up the event listener on unmount
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return windowWidth;
}