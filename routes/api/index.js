const { Router } = require("express");
const { streamApiKey } = require("../../config");

const router = Router();

router.get('/', (req, res) => {
    return res.sendStatus(200);
});

router.post('/', (req, res) => {
    const io = req.socket;
    console.log("Attempting to connect to video Stream source");
    if (req.query.key !== streamApiKey) return res.sendStatus(403);
    console.log("Connected to video source");
    io.emit('starting');
    console.log("Starting stream.");
    res.connection.setTimeout(0);
    req.on('data', (data) => {
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
        if (Object.getOwnPropertyNames(io.sockets.clients().connected).length) io.emit('video', data);
    });
    //ffmpeg -f dshow -rtbufsize 100M -i video=<videoInput> -f mpegts -codec:v mpeg1video -s 640x480 -b:v 800k -r 25 -bf 0 <outSource>
    //ffmpeg -f dshow -rtbufsize 100M -i video="USB2.0 HD IR UVC WebCam" -f mpegts -codec:v mpeg1video -s 640x480 -b:v 800k -r 25 -bf 0 http://127.0.0.1:5000/api?key=...
    req.on('end', () => {
        console.log("Video source closed.");
        io.emit('close');
        res.sendStatus(200)
    });
});

module.exports = router;