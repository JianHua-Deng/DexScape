// src/hooks/usePaginatedMangaData.js
import { useState, useEffect } from "react";
import { searchMangas } from "../../utils/mangaDexApi";
import { getMangaListConfig } from "../../utils/utils";


export function useCustomPaginated({ fetchData, sortField, page, offSet }) {
  const [databaseData, setDatabaseData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [mangaList, setMangaList] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and sort the complete dataset
  useEffect(() => {
    async function getData() {
      const dataset = await fetchData();
      // Sort descending based on the provided sort field
      dataset.sort((a, b) => new Date(b[sortField]) - new Date(a[sortField]));
      //console.log(dataset);
      setDatabaseData(dataset);
      setTotalItems(dataset.length);
      setDataFetched(true);
    }
    
    getData();
  }, [fetchData, sortField]);

  // Fetch manga details for the current page
  useEffect(() => {
    if (!dataFetched) return;

    if (databaseData.length > 0) {
      const startIndex = (page - 1) * offSet;
      const endIndex = startIndex + offSet;
      const currentPageData = databaseData.slice(startIndex, endIndex);
      setPageData(currentPageData);
      const mangaIDs = currentPageData.map((item) => item.manga_id);
      const searchConfig = getMangaListConfig(mangaIDs, offSet);
      searchMangas(searchConfig).then((resp) => {
        setMangaList(resp);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [dataFetched, databaseData, page]);

  return { pageData, mangaList, totalItems, isLoading, setIsLoading };
}
