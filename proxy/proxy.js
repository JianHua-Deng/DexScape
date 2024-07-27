import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

const mangaCoversProxy = createProxyMiddleware({
    target: 'https://uploads.mangadex.org/covers/',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        log('Proxying request:' + req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        log('Received response for:' + req.url);
    },

})


app.use('/covers', mangaCoversProxy);

app.listen(PORT, () => {
    console.log("It is currently running on PORT: " + PORT);
})