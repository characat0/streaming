const io = require('socket.io-client');
for (let i = 0; i < 1; i++) {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
        console.log('connected');
        socket.on('video', (data) => {
            let cache = data;
            setTimeout(()=>{
                cache = null;
            }, 1000);
        });
    });
}
