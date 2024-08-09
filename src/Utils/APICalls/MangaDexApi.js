import axios from "axios";

//const proxyUrl = process.env.PROXY_URL;
const proxyUrl = "http://localhost:5173"
const queryMangasUrl = "https://api.mangadex.org/manga";
const queryChaptersUrl = "https://api.mangadex.org/at-home/server/";



async function searchMangas(title){
    console.log("Search Manga, ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `/manga`,
        params: {
            title: title,
            includes: ["authors", "artist", "cover_art"],
        }
    }).catch( e => {
        console.log(e);
    })

    return resp.data.data;
}


async function searchLatestUploads(limitNumber){
    console.log("ProxyUrl: " + proxyUrl + "\n" + "Port: " + process.env.PORT);
    const resp = await axios({
        method: "GET",
        url: `/manga`,

        params: {
            limit: limitNumber,
            includes: ["authors", "artist", "cover_art"],
            order: {
                createdAt: 'desc'
            }
        }
    }).then(respond => {
        console.log(respond);
        return respond.data.data;
    }).catch((e) => {
        console.log(e)
        return [];
    });

    return resp;
}

async function searchPopularUploads(limitNumber){
    const resp = await axios({
        method: "GET",
        url: `/manga`,
        params: {
            limit: limitNumber,
            includes: ["authors", "artist", "cover_art"],
            order: {
                rating: 'desc',
                followedCount: 'desc'
            }
        }
    }).then(respond =>{
        console.log(respond.data.data);
        return respond.data.data;
    }).catch(e => {console.log(e)});

    return resp;
}

async function fetchChapterList(mangaID, languages){
    const resp = await axios({
        method: "GET",
        url: `/manga/${mangaID}/feed`,

        params:{
            limit: 500,
            translatedLanguage: languages,
            order: {
                chapter: 'asc',
            }
        }
    }).then(respond => {
        console.log(respond.data.data);
        return respond.data.data;
    }).catch(e => {console.log(e);})

    return resp;
}

async function getChapterMetaData(chapterID){

    const resp = await axios({
        method: "GET",
        url: `/at-home/server/${chapterID}`,
    }).then((respond) => {
        //console.log(respond.data);
        return respond.data;
    }).catch(error => {
        console.log(error);
    })
        
    return resp;
    
}



export {searchMangas, searchLatestUploads, searchPopularUploads, fetchChapterList, getChapterMetaData};

