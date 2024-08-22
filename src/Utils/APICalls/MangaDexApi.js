import axios from "axios";

//const proxyUrl = process.env.PROXY_URL;
//const proxyUrl = "http://localhost:5173"
const proxyUrl = `${process.env.PROXY_URL}`;
const queryMangasUrl = "https://api.mangadex.org/manga";
const queryChaptersUrl = "https://api.mangadex.org/at-home/server/";


/*
async function searchMangas(title){
    console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `/manga`,
        params: {
            limit: 24,
            title: title,
            includes: ["authors", "artist", "cover_art", "total"],
        }
    }).catch( e => {
        console.log(e);
    })

    return resp.data.data;
}
*/

async function searchMangas(searchConfig){
    console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `${proxyUrl}/manga`,
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

