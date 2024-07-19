import { useState } from "react";
import { Link } from "react-router-dom";
import { searchMangas } from "../../Utils/APICalls/MangaDexApi";
import "./Searchbar.css";

function Searchbar(){

    const [queryContent, setQueryContent] = useState('');

    return (
        <>
            <form className="searchbar" onSubmit={() => {
                e.preventDefault();
                setQueryContent('');
            }}>
                <input type="text" name="search" className="searchbar-field" onChange={(e) => {setQueryContent(e.target.value)}} required></input>
                <Link to={`/search/${queryContent}`}><button className="search-button" type="submit">Search</button></Link>
            </form>
        
        </>
    );
}

export default Searchbar;