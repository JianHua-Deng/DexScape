import axios from "axios";

const title = 'Kanojyo to Himitsu to Koimoyou';
const proxyUrl = "https://corsproxy.io/";
const infoUrl = "https://api.mangadex.org/manga";
const coverUrl = "https://uploads.mangadex.org/covers";

const apiCallUrl = `${proxyUrl}?${infoUrl}?title=${encodeURIComponent(title)}`;
//const coverUrl = `${proxyUrl}${coverUrl}?`
const id = "e0a8eefb-4859-44c1-aa44-6550618eae85";

async function fetchMangaInfo(){

    const options = {
        method: "GET",
        headers: {},
    }

    const response = await fetch(apiCallUrl, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(data);

    return data;
    
}

export default fetchMangaInfo;