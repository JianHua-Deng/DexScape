import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3000;
const app = express();
/*
app.use(cors({
    origin: 'https://manga-site-production.up.railway.app', //Railway app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
*/

// Set middleware of CORS 
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://manga-site-production.up.railway.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

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
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        console.log('Received response for:' + req.url);
    },

})

app.use('/manga', mangaSearchProxy);
app.use('/covers', mangaCoversProxy);


app.listen(PORT, () => {
    console.log("It is currently running on PORT: " + PORT);
})