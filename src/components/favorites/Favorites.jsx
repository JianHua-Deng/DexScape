import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "../../lib/AuthContext";
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import { getUserFavoriteMangas, removeFavorited } from "../../utils/supabase";
import { useCustomPaginated } from "../hooks/useCustomPaginated";
import Skeleton from "react-loading-skeleton";
import EmptyState from "../ui/EmptyState";
import HorizontalMangaCard from "../horizontal-manga-card/HorizontalMangaCard";
import { scrollToStart } from "../../utils/utils";
import toast from "react-hot-toast";

export default function Favorites() {

  const mainContent = useRef();
  const offSet = 10;
  const { session, userID, loading } = useAuth();
  const { theme } = useThemeProvider();
  const { page } = useParams();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    scrollToStart(mainContent);
  }, [page]);

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Login to use this function");
      navigate('/login');
    }
  }, [loading, session]);

  // The refresh is in the dependency array so that changes trigger a refetch
  const fetchFavoritesData = useCallback(() => getUserFavoriteMangas(userID), [userID, refresh]);
  const { pageData, mangaList, totalItems, isLoading, setIsLoading} = useCustomPaginated({
    fetchData: fetchFavoritesData,
    sortField: "added_at",
    page: Number(page),
    offSet,
  });

  const pageCount = Math.ceil(totalItems / offSet);

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setIsLoading(true);
    navigate(`/favorites/${newPage}`);
  };

  // Handle deletion of a favorite
  const handleDeleteFavorite = async (mangaID) => {
    try {
      await removeFavorited(userID, mangaID);
      toast.success("Removed from favorites!");
      // Trigger a refresh to refetch the data
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Error removing favorite.");
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <div ref={mainContent} className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4">
        <h1 className={`${theme === 'dark' ? 'text-lightText' : 'text-darkText '} text-3xl`}>My Favorites</h1>
        <div className="flex-grow">
          {isLoading ? (
            Array(10)
              .fill(0)
              .map((_, index) => (
                <div className="mb-2" key={index}>
                  <Skeleton className="w-full h-48" />
                </div>
              ))
          ) : (
            pageData.length === 0 ? (
              <EmptyState titleTextContent={"No Favorites"} textContent={"You haven't added any Manga as your Favorites yet. Start adding them up!"} />
            ) : (
              pageData.map((historyItem) => {
                const manga = mangaList?.data?.find(m => m.id === historyItem.manga_id);
                if (!manga) return null;
                return (
                  <HorizontalMangaCard 
                    key={manga.id} 
                    manga={manga} 
                    readAt={historyItem?.read_at}
                    chapter={historyItem?.chapter}
                    page={historyItem?.page}
                    onDelete={handleDeleteFavorite}
                  />
                );
              })
            )
          )}          
        </div>
        <div className="w-full p-4 flex justify-evenly">
        <Pagination
          pageCount={pageCount}
          currentPage={page}
          onPageChange={handlePageChange}
          pageRange={3}
          marginPagesDisplayed={1}
        />
        </div>
      </div>
    </div>
  )
}