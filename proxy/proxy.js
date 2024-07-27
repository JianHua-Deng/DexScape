import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({
    origin: 'https://manga-site-production.up.railway.app', //Railway app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});



const mangaCoversProxy = createProxyMiddleware({
    target: 'https://uploads.mangadex.org/covers/',
    changeOrigin: true,
    pathRewrite: {
        "^/covers": "/covers",
    },
    logLevel: 'debug',
    logger: console,
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:' + req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        //proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        console.log('Received response for:' + req.url);
    },

});

const mangaSearchProxy = createProxyMiddleware({
    target: 'https://api.mangadex.org/manga',
    changeOrigin: true,
    pathRewrite: {
        "^/manga": "/manga",
    },
    logLevel: 'debug',
    logger: console,
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:' + req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        //proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        console.log('Received response for:' + req.url);
    },

})

app.use('/manga', mangaSearchProxy);
app.use('/covers', mangaCoversProxy);


app.listen(PORT, () => {
    console.log("It is currently running on PORT: " + PORT);
})