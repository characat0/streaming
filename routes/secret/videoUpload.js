const { Router } = require("express")
const { streamApiKey } = require("../../config");
let receiving = false;



function onConnect(socket) {
    console.log("connected!");
    socket.binary(false).emit('starting');
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
    if (req.app.set('onlineSockets')) io.binary(false).emit('starting');
    io.on('connection', onConnect);
    req.on('data', data => {
        if (req.app.set('onlineSockets')) io.binary(true).emit('video', data);
    });
    req.on('end', () => {
        if (req.app.set('onlineSockets')) io.binary(false).emit('close');
        io.removeListener('connection', onConnect);
        receiving = false;
    })
});

module.exports = router;