const { Router } = require("express");
const { streamApiKey, saveVideo } = require("../../config");
const { Mp4Segmenter } = require("../../lib/Mp4Segmenter");
const fs = require("fs");
const path = require("path");
let receiving = false;

const mp4Segmenter = new Mp4Segmenter();


function onConnect(socket) {
    console.log("connected!");
    socket.binary(false).emit('starting');
}

function sendVideo(stream) {

}

const router = Router();
router.post("/", (req, res) => {
    //ffmpeg -y -f dshow -re -i video="USB2.0 HD IR UVC WebCam":audio="Microphone (Realtek(R) Audio)" -preset ultrafast -vcodec libx264 -tune zerolatency -g 102 -bufsize 4.8M -b:v 1M -movflags +frag_keyframe+empty_moov+default_base_moof -f mp4 http://localhost:5000/api/video?key=ccat
    const io = req.app.get('socket');
    if (!io) return res.sendStatus(500);
    console.log("Attempting to post video source.");
    if (receiving || !req.on) {
        console.log("Attempt failed!");
        return res.sendStatus(403);
    }
    console.log("Attempt succeeded");
    receiving = true;
    req.pipe(mp4Segmenter);
    mp4Segmenter.on('initSegment', (initSegment) => {
        io.emit('start', { initSegment });
    })
    mp4Segmenter.on('initSegment', console.log);
    mp4Segmenter.on('data', (data) => {
        io.binary(true).emit('data', data);
        console.log(data.length);
    })
    mp4Segmenter.on('error', console.error);
    const videoPath = path.resolve(__dirname, "../../videos", Date.now() + ".mpg");
    //const video = fs.createWriteStream(videoPath);
    if (req.app.set('onlineSockets')) io.binary(false).emit('starting');
    io.on('connection', onConnect);
    /*req.on('data', data => {
        if (req.app.set('onlineSockets')) io.binary(true).emit('video', data);
        if (saveVideo) video.write(data, "binary");
    });
    req.on('end', () => {
        if (req.app.set('onlineSockets')) io.binary(false).emit('close');
        io.removeListener('connection', onConnect);
        video.end();
        if (!saveVideo) fs.unlink(videoPath, e => e ? console.error(e) : null);
        receiving = false;
    })*/
});

module.exports = router;