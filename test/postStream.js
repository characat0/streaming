const request = require("request");
const fs = require("fs");
const upload = fs.createReadStream('./grb_1.mpg');

const r = request.post("http://localhost:5000/api/video");
upload.pipe(r);
upload.on('data', (chunk) => {
    console.log("sended", chunk);
});
upload.on('end', (res) => {
    console.log("finished");
});