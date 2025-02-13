import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const [queryContent, setQueryContent] = useState('');
  const navigate = useNavigate();

  return (
    <form
      // The container: mobile-first uses a max width of 20rem (max-w-xs)
      // then from small screens upward it grows (sm:max-w-md) and on large screens (lg:max-w-xl)
      className="flex justify-center items-center w-full max-w-xs sm:max-w-md lg:max-w-xl gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search/${queryContent}/1`);
        setQueryContent('');
      }}
    >
      <input
        type="text"
        name="search"
        value={queryContent}
        placeholder=" Enter any Manga name"
        className="h-10 w-52 p-3 md:w-96 rounded-md border border-button focus:outline-none focus:border-supplementary"
        onChange={(e) => setQueryContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="flex justify-center items-center w-16 h-auto text-xs md:w-auto md:h-auto md:text-base"
      >
        Search
      </button>
    </form>
  );
}

export default Searchbar;
