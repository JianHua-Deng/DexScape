import { useEffect } from "react";
import { useState } from "react";
import { searchMangas } from "../Utils/APICalls/MangaDexApi";



function Shelf() {

    const [data, setData] = useState([]);

    useEffect(() =>{
        searchMangas().then((resp) =>{
            setData(resp);
            console.log(resp);
        })

    }, []);

    return(
        <div className="shelf-container">

        </div>
    );
}


export default Shelf;