// src/components/history/history.jsx
import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../lib/AuthContext";  
import { getLatestReadingHistory } from "../../utils/supabase";
import Pagination from "../pagination/Pagination";
import HorizontalMangaCard from "../horizontal-manga-card/HorizontalMangaCard";
import { useThemeProvider } from "../../lib/ThemeContextProvider";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { scrollToStart } from "../../utils/utils";
import toast from "react-hot-toast";
import { useCustomPaginated } from "../hooks/useCustomPaginated";
import EmptyState from "../ui/EmptyState";

export default function History() {
  const mainContent = useRef();
  const offSet = 10;
  const { session, userID, loading } = useAuth();
  const { theme } = useThemeProvider();
  const { page } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Login to use this function");
      navigate('/login');
    }
  }, [loading, session]);

  useEffect(() => {
    scrollToStart(mainContent);
  }, [page]);


  const fetchHistoryData = useCallback(() => getLatestReadingHistory(userID), [userID]);
  // Use our custom hook, passing in getLatestReadingHistory and sorting by "read_at"
  const { pageData, mangaList, totalItems, isLoading, setIsLoading } = useCustomPaginated({
    fetchData: fetchHistoryData,
    sortField: "read_at",
    page: Number(page),
    offSet,
  });

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setIsLoading(true);
    navigate(`/history/${newPage}`);
  };

  const pageCount = Math.ceil(totalItems / offSet);



  return (
    <div className="min-h-screen">
      <div ref={mainContent} className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4">
        <h1 className={`${theme === 'dark' ? 'text-lightText' : 'text-darkText '} text-3xl`}>History</h1>
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
              <EmptyState titleTextContent={"No Reading History"} textContent={"You haven't read any Manga yet. Start reading to see your history tree!"} />
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
  );
}
