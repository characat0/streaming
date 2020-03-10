const express = require("express");
const path = require("path");
const { streamPostRoute } = require("./config");
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

app.use("/public", express.static(path.resolve(__dirname, './public')));
app.use(streamPostRoute, videoUploadRoute);

app.use("/", streamRoute);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/strm', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/streaming');
            } else {
                response.send('Usuarios y/o contraseña incorrecta!');
            }			
            response.end();
        });
    } else {
        response.send('Por favor ingrese un usuario y contraseña!');
        response.end();
    }
});

module.exports = app;