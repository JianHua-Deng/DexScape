import axios from "axios";

const proxyUrl = "https://corsproxy.io/";
const infoUrl = "https://api.mangadex.org/manga";
const coverUrl = "https://uploads.mangadex.org/covers"


async function searchMangas(title){
    const resp = await axios({
        method: "GET",
        url: infoUrl,
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
 
async function searchLatestUploads(){
    const resp = await axios({
        method: "GET",
        url: infoUrl,
        proxy: {
            url: proxyUrl,
        },
        params: {
            limit: 15,
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

async function searchPopular(){
    
}

export {searchMangas, searchLatestUploads};

