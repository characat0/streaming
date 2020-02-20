const express = require("express");
const path = require("path");
const fs = require("fs");
const { streamPostRoute, streamApiKey } = require("./config");
const streamRoute = require("./routes/stream");
const stream = require("stream");
const app = express();
const { Router } = require("express");
const video = Router();




app.setRoutes = () => {
    const io = app.set('socket');
    app.use("/public", express.static(path.resolve(__dirname, './public')));
    video.post('/', (req, res) => {
        console.log("Attempting to connect to video Stream source");
        if (req.query.key !== streamApiKey) return res.sendStatus(403);
        console.log("Connected to video source");
        res.connection.setTimeout(0);
        req.on('data', (data) => {
            console.log("Data packet recieved, length:", data.length, "timestamp:", new Date(Date.now()));
            /*bytes += data.length;
            if (bytes > 1024*1024) {
                console.log("Switching file writing streams!");
                bytes = 0;
                const pStream = streams[streams.length - 1];
                const nStream = fs.createWriteStream(`./video${streams.length}.mpg`, { encoding: null, autoClose: true });
                req.unpipe(pStream);
                req.pipe(nStream);
                streams.push(nStream);
            }*/
            io.sockets.emit('video', data);
        });
        req.on('end', () => {
            io.sockets.emit('close')
            res.sendStatus(200)
        });
    });

    app.use(streamPostRoute, video);
    app.use("/stream", streamRoute);
};


module.exports = app;