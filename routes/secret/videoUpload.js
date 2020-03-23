const { Router } = require("express");
const { streamApiKey, saveVideo } = require("../../config");
const fs = require("fs");
const path = require("path");
let receiving = false;



function onConnect(socket) {
    console.log("connected!");
    socket.binary(false).emit('starting');
}

function sendVideo(stream) {

}

const router = Router();
router.post("/", (req, res) => {
    const io = req.app.set('socket');
    if (!io) return res.sendStatus(500);
    console.log("Attempting to post video source.");
    if (receiving || req.query.key !== streamApiKey || !req.on) {
        console.log("Attempt failed!");
        return res.sendStatus(403);
    }
    console.log("Attempt succeeded");
    receiving = true;
    const videoPath = path.resolve(__dirname, "../../videos", Date.now() + ".mpg");
    const video = fs.createWriteStream(videoPath);
    if (req.app.set('onlineSockets')) io.binary(false).emit('starting');
    io.on('connection', onConnect);
    req.on('data', data => {
        if (req.app.set('onlineSockets')) io.binary(true).emit('video', data);
        if (saveVideo) video.write(data, "binary");
    });
    req.on('end', () => {
        if (req.app.set('onlineSockets')) io.binary(false).emit('close');
        io.removeListener('connection', onConnect);
        video.end();
        if (!saveVideo) fs.unlink(videoPath, e => e ? console.error(e) : null);
        receiving = false;
    })
});

module.exports = router;