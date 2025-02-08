import { useAuth } from "../../lib/AuthContext";
import Searchbar from "../searchbar/Searchbar";
import { Link } from "react-router-dom";

function Header() {
  const { session, signOut } = useAuth();

  return (
    <div
      className="
        bg-[var(--primary-color)] 
        sticky top-0 
        p-8
        shadow-[0_1px_5px_var(--box-shadow-color)]
        max-h-8
        row-start-1 row-end-2 
        col-start-1 col-end-4 
        flex justify-between items-center 
        gap-4 md:gap-0 
        md:col-start-2 md:col-end-3
        z-[2]
      "
    >
      <nav
        className="
          flex justify-items-end
          text-[0.8rem] w-[25rem] gap-[0.7rem]
          md:text-base md:w-[15rem] md:gap-[1.5rem]
        "
      >
        {session ? (
          <Link to="/" onClick={signOut}>Sign out</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/">Home</Link>
        <Link to="/latest/1">Latest</Link>
        <Link to="/popular/1">Popular</Link>
      </nav>
      <div
        className="
          w-[30rem] flex justify-evenly 
          max-[450px]:w-[8rem]
        "
      >
        <Searchbar />
      </div>
    </div>
  );
}

export default Header;