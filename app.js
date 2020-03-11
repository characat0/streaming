const express = require("express");
const path = require("path");
const { streamPostRoute, sessionSecret } = require("./config");
const streamRoute = require("./routes/stream");
const videoUploadRoute = require("./routes/secret/videoUpload");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');

//ffmpeg -f dshow -rtbufsize 100M -i video="USB2.0 HD IR UVC WebCam":audio="Microphone (Realtek(R) Audio)" -f mpegts -codec:v mpeg1video -s 640x480 -b:v 800k -r 25 -bf 0 <outSource>

var connection = mysql.createConnection({
	host     : 'b0szyfe7nkk86y122jws-mysql.services.clever-cloud.com',
	user     : 'ulbof20vmt20v0qi',
	password : 'tpgziIpbxCZ0Y65kyvEH',
	database : 'b0szyfe7nkk86y122jws'
});
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));

app.use("/public", express.static(path.resolve(__dirname, './public')));
app.use(streamPostRoute, videoUploadRoute);

app.use("/", streamRoute);

module.exports = app;