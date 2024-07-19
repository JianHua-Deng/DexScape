import { Link } from "react-router-dom";
import "./Sidebar.css"
function Sidebar(){

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link>#</Link>
            <Link>#</Link>
        </nav>
    );
}

export default Sidebar;