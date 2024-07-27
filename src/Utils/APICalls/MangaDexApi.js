import axios from "axios";

const proxyUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` || 'http://localhost:5000';
const queryMangasUrl = "https://api.mangadex.org/manga";
const queryChaptersUrl = "https://api.mangadex.org/at-home/server/";


async function searchMangas(title){
    const resp = await axios({
        method: "GET",
        url: queryMangasUrl,
        proxy:{
            url: proxyUrl,
        },
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
    console.log("ProxyUrl: " + proxyUrl);
    const resp = await axios({
        method: "GET",
        url: queryMangasUrl,
        proxy: {
            url: proxyUrl,
        },
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
        url: queryMangasUrl,
        proxy: {
            url: proxyUrl,
        },
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
        url: `${queryMangasUrl}/${mangaID}/feed`,
        proxy: {
            url: proxyUrl,
        },
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

export {searchMangas, searchLatestUploads, searchPopularUploads, fetchChapterList};

