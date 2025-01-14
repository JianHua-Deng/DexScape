import axios from "axios";
import { defaultSearchConfig } from "../Utils";

const proxyUrl = `${process.env.PROXY_URL}`;
/*
GET /mangaList/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc 
-> 
https://api.mangadex.org/manga?limit=15&includes[]=authors&includes[]=artist&includes[]=cover_art&status[]=completed&order[rating]=desc&order[followedCount]=desc [200]
*/
async function searchMangas(searchConfig){
    console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/mangaList/manga`,
        params: searchConfig
    }).catch( e => {
        console.log(e);
    })

    console.log(resp.data.data);
    return resp.data.data;
}

async function searchSpecificManga(mangaID){
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/manga/${mangaID}`,
        params: defaultSearchConfig,
    }).catch( e => {
        console.log(e);
    })

    console.log(resp.data.data);
    return resp.data.data;
}

async function fetchChapterList(mangaID, config){
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/manga/${mangaID}/feed`,
        params: config,

    }).then(respond => {
        //console.log(respond.data.data);
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



export {searchMangas, searchSpecificManga, fetchChapterList, getChapterMetaData};

