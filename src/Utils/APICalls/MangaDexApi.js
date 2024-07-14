import axios from "axios";

const title = 'Kanojyo to Himitsu to Koimoyou';
const proxyUrl = "https://corsproxy.io/";
const infoUrl = "https://api.mangadex.org/manga";

const id = "e0a8eefb-4859-44c1-aa44-6550618eae85";


async function searchMangas(){
    const resp = await axios({
        method: "GET",
        url: infoUrl,
        proxy:{
            url: proxyUrl,
        },
        params: {
            title: title
        }
    }).catch( e => {
        console.log(e);
    })

    return resp;

    
}


/*  
async function searchMangas(){
    return await axios.get(proxyUrl, {
        params: {
            url: infoUrl,
            title: title,
        }
    }).catch(e => {console.log(e)});
}
*/

export {searchMangas};

