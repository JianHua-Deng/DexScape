import express from 'express';
import cors from 'cors';
import {createProxyMiddleware} from 'http-proxy-middleware';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({path: './.env'})

const PORT = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use("/manga", (req, res, next) => {
  req.headers = {};
  next(); 
});

app.use("/covers", (req, res, next) => {
    req.headers = {};
    next(); 
  });

app.use("/at-home", (req, res, next) => {
  req.headers = {};
  next(); 
});


const mangaCoversProxy = createProxyMiddleware({
    target: 'https://uploads.mangadex.org/covers/',
    changeOrigin: true,
    logLevel: 'debug',
    logger: console,

});

const mangaSearchProxy = createProxyMiddleware({
    target: 'https://api.mangadex.org/manga/',
    changeOrigin: true,
    logLevel: 'debug',
    logger: console,

});

const chapterMetaDataProxy = createProxyMiddleware({
  target: 'https://api.mangadex.org/at-home/',
  changeOrigin: true,
  logLevel: 'debug',
  logger: console,
});

const chapterImageProxy = createProxyMiddleware({
  target: 'https://uploads.mangadex.org',
  changeOrigin: true,
  logLevel: 'debug',
  logger: console,
  router: (req) => {
    const baseUrl = req.url.match(/(?<=https?:\/\/)[^\/]+(?=\/data)/); // Matching the baseUrl and only the baseUrl from the request
    if (baseUrl){
      //console.log(`Original URL: ${req.url}, BaseUrl: ${baseUrl}`);
      return baseUrl.includes('https://') ? `${baseUrl}` : `https://${baseUrl}`;
    }
    return 'https://uploads.mangadex.org';
  },
  pathRewrite: (path, req) => {
    // Empty out anything before /data, and take that as the path
    return path.replace(/^.*(?=\/data)/, "");
  },

})

app.use(cors());

//app.use(morgan('dev'));

app.use('/manga', mangaSearchProxy);
app.use('/covers', mangaCoversProxy);
app.use('/at-home', chapterMetaDataProxy);
app.use('/chapter-image', chapterImageProxy);

// Serve index.html for any other routes (client-side routing fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log("It is currently running on PORT: " + PORT);
})

export default app;