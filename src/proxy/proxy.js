
const express = require('express');
const cors = require('cors');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
app.use(cors());

const options = {

}