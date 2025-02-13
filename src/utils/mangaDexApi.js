import axios from "axios";
import { defaultSearchConfig } from "./utils";

const proxyUrl = `${process.env.PROXY_URL}`;
/*
GET /mangaList/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc 
-> 
https://api.mangadex.org/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc [200]
*/
async function searchMangas(searchConfig){
    //console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/mangaList/manga`,
        params: searchConfig
    }).catch( e => {
        console.log(e);
    })

    console.log(resp);
    return resp.data;
}

async function searchSpecificManga(mangaID){
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/manga/${mangaID}`,
        params: defaultSearchConfig,
    }).catch( e => {
        console.log(e);
    })

    //console.log(resp.data.data);
    return resp.data.data;
}

async function fetchChapterList(mangaID, config){
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/manga/${mangaID}/feed`,
        params: config,

    }).then(respond => {
        console.log(respond.data.data);
        return respond.data.data;
    }).catch(e => {console.log(e);})

    return resp;
}

async function getChapterMetaData(chapterID){

    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/at-home/server/${chapterID}`,
    }).then((respond) => {
        //console.log(respond.data);
        return respond.data;
    }).catch(error => {
        console.log(error);
    })
        
    return resp;
    
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



export {searchMangas, searchSpecificManga, fetchChapterList, getChapterMetaData, getCoverUrl};

