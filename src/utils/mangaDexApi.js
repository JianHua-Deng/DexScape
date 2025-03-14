import axios from "axios";
import { defaultSearchConfig } from "./utils";

const proxyUrl = `${process.env.PROXY_URL}`;
/*
GET /mangaList/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc 
-> 
https://api.mangadex.org/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc [200]
*/

async function getAllTags(){
  try {
    const resp = await axios({
      method: "GET",
      url: `${proxyUrl}/manga/tag`
    })

    return resp.data.data;

  } catch (error) {
    console.error("Error getting all tags", error);
    throw error;
  }

}

async function getChapterInfo(chapterID) {
  try{
    const resp = await axios({
      method: "GET",
      url: `${proxyUrl}/chapter/${chapterID}`,
    });
    return resp.data.data;

  } catch (error) {
    console.error("Error fetching Chapter Info", error);
    throw error;
  }
}

async function searchMangas(searchConfig){
    //console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    try {
      const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/mangaList/manga`,
        params: searchConfig
      });
      return resp.data;

    } catch (error) {
      console.error("Error fetching Mangas", error);
      throw error;
    }

    //console.log(resp);
}

async function searchSpecificManga(mangaID){

  try {
    const resp = await axios({
      method: "GET",
      url: `${proxyUrl}/manga/${mangaID}`,
      params: defaultSearchConfig,
    })
    return resp.data.data;

  } catch (error) {
    console.error("Error fetching specifc Manga", error);
    throw error;
  }


    //console.log(resp.data.data);
}

async function fetchChapterList(mangaID, config){

  try {
    const resp = await axios({
      method: "GET",
      url: `${proxyUrl}/manga/${mangaID}/feed`,
      params: config,
    });
    return resp.data.data;

  } catch (error) {
    console.error("Error fetching chapter list", error);
    throw error;
  }

}

async function getChapterMetaData(chapterID){

  try {
    const resp = await axios({
      method: "GET",
      url: `${proxyUrl}/at-home/server/${chapterID}`,
    });
    return resp.data;

  } catch (error) {
    console.error("Error getting chapter metadata", error);
    throw error;
  }
    
}

function getCoverUrl(manga){
  //console.log(manga);
  const baseUrl =  `${process.env.PROXY_URL}`;
  //const baseUrl = "http://localhost:5173"
  const params = `${manga.id}/${manga.relationships.find(relationship => relationship.type === "cover_art").attributes.fileName}.512.jpg`;
  const coverUrl = `${baseUrl}/covers/${params}`;
  
  //console.log(coverUrl);
  return coverUrl;
}



export { getAllTags, getChapterInfo, searchMangas, searchSpecificManga, fetchChapterList, getChapterMetaData, getCoverUrl};

