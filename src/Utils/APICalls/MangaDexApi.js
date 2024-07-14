import axios from "axios";

const title = 'Kanojyo to Himitsu to Koimoyou';
const proxyUrl = "https://corsproxy.io/";
const infoUrl = "https://api.mangadex.org/manga";
const coverUrl = "https://uploads.mangadex.org/covers";

const searchMangaUrl = `${proxyUrl}?${infoUrl}?title=${title}`;
//const coverUrl = `${proxyUrl}${coverUrl}?`
const id = "e0a8eefb-4859-44c1-aa44-6550618eae85";

console.log(searchMangaUrl);

async function searchMangas(){
    const resp = await axios({
        method: "GET",
        url: `${searchMangaUrl}/manga`,
        params: {
            title: title,
        }
    });

    return resp.data.data;

    
}

export {searchMangas};

