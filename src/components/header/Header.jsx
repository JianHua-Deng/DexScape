import Searchbar from "../searchbar/Searchbar"
import './Header.css'
import { Link } from "react-router-dom";

function Header(){

    return (
        <>
            <div className="header-container">
                <nav className="nav-container">
                    <Link to="/">Home</Link>
                    <Link>Latest</Link>
                    <Link>Popular</Link>
                </nav>
                <div className="searchbar-container"><Searchbar/></div>
            </div>
        </>
    );
}

export default Header;