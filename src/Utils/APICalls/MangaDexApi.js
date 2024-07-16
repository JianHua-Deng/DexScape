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
 
async function searchLatestUpload(){
    const resp = await axios({
        method: "GET",
        url: infoUrl,
        proxy: {
            url: proxyUrl,
        },
        params: {
            limit: 20,
            includes: ["authors", "artist", "cover_art"],
            order: {
                createdAt: 'desc'
            }
        }
    }).then(respond => {
        console.log(respond.data.data);
        return respond.data.data;
    }).catch((e) => {
        console.log(e)
        return [];
    });

}

export {searchMangas, searchLatestUpload};

