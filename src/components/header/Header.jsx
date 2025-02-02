import { useAuth } from "../../lib/AuthContext";
import Searchbar from "../searchbar/Searchbar"
import './Header.css'
import { Link } from "react-router-dom";


function Header(){

    const { session, signOut } = useAuth();

    return (
        <>
            <div className="header-container">
                <nav className="nav-container">
                    {session ? (<Link to="/" onClick={signOut}>Sign out</Link>) : (<Link to="/login">Login</Link>)}
                    <Link to="/">Home</Link>
                    <Link to="/latest/1">Latest</Link>
                    <Link to="/popular/1">Popular</Link>
                </nav>
                <div className="searchbar-container"><Searchbar/></div>
            </div>
        </>
    );
}

export default Header;