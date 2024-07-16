import { useState } from "react";
import { searchMangas } from "../Utils/APICalls/MangaDexApi";
import "../styles/Searchbar.css";

function Searchbar({value, fetchResponseFunc, onChangeFunc}){

    return (
        <>
            <form className="searchbar" onSubmit={fetchResponseFunc}>
                <input type="text" name="search" value={value} className="searchbar-field" onChange={onChangeFunc}></input>
                <button className="search-button" type="submit">Search</button>
            </form>
        
        </>
    );
}

export default Searchbar;