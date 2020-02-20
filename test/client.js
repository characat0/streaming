const io = require('socket.io-client');
const socket = io('http://localhost:5000');
socket.on('connect', () => {
    console.log('connected');
    socket.emit('GET_CHUNK_STREAM', 11);
    socket.on('VIDEO', console.log);
});
