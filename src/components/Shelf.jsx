import { useEffect } from "react";
import fetchMangaInfo from "../assets/Utils/APICalls/MangaDexApi";



function Shelf() {

    useEffect(() =>{
        /*
        async function getData(){
            //to print the data
            const data = await fetchMangaInfo();
            console.log(data.data);
        }

        getData();
        */
       fetchMangaInfo().then((response) => {
        console.log(response);
       }).catch((e) => {
        console.log(e);
       });
    }, []);

    return(
        <div className="shelf-container">

        </div>
    );
}


export default Shelf;