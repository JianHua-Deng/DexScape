import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useHeaderSticky() {
    const [isSticky, setIsSticky] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const isReaderPage = location.pathname.includes("/comic/") && location.pathname.includes('/chapter/');

        if(isReaderPage){
          setIsSticky(false);
          return
        }

        setIsSticky(true);


    }, [location]);

    return isSticky;
}