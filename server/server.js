const webpack = require('webpack');
const webpackConfig = require("../webpack.config.js");
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const fs = require("fs");
const https = require("https");

const privateKey  = fs.readFileSync('./selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./selfsigned.crt', 'utf8');



const compiler = webpack(webpackConfig);
const app = express();

app.use("/",express.static(webpackConfig.output.publicPath));

const server = https.createServer( {
    key: privateKey,
    cert: certificate
}, app)

app.use(devMiddleware(compiler, webpackConfig.devServer.devMiddleware));
app.use(hotMiddleware(compiler, webpackConfig.devServer.hotMiddleware));

server.listen(webpackConfig.devServer.port, () => console.log('Example app listening on port 3000!'));