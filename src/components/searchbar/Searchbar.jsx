import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { searchMangas } from "../../Utils/APICalls/MangaDexApi";
import "./Searchbar.css";

function Searchbar(){

    const [queryContent, setQueryContent] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <form className="searchbar" onSubmit={(e) => {
                e.preventDefault();
                navigate(`/search/${queryContent}/1`);
                setQueryContent('');
            }}>
                <input type="text" name="search" value={queryContent} className="searchbar-field" onChange={(e) => {setQueryContent(e.target.value)}} required></input>
                <button className="search-button" type="submit">Search</button>
            </form>
        
        </>
    );
}

export default Searchbar;