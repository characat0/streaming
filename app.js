const express = require("express");
const path = require("path");
const { streamPostRoute } = require("./config");
const streamRoute = require("./routes/stream");
const videoUploadRoute = require("./routes/secret/videoUpload");
const app = express();

//ffmpeg -f dshow -rtbufsize 100M -i video="USB2.0 HD IR UVC WebCam":audio="Microphone (Realtek(R) Audio)" -f mpegts -codec:v mpeg1video -s 640x480 -b:v 800k -r 25 -bf 0 <outSource>
app.use("/public", express.static(path.resolve(__dirname, './public')));
app.use(streamPostRoute, videoUploadRoute);
app.use("/stream", streamRoute);

module.exports = app;