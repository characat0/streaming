const { Router } = require("express");
const { Login } = require("../schema");
const crypto = require("crypto");
const path = require("path");
const router = Router();

router.get('/', (req, res) => {

    //Agregar lo comentado como principal cuando haya base de datos
    const p = path.resolve(__dirname, '../', 'views', 'login.html');

    //const p = path.resolve(__dirname, '../', 'views', 'stream.html');
    res.sendFile(p);
});
router.post('/', (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) return res.sendStatus(400);
    password = crypto.createHash('md5').update(password).digest('hex');
    Login.findOne({ where: { username, password }, rejectOnEmpty: true })
        .then(() => {
            req.session.loggedIn = true;
            req.session.username = username;
            return res.sendStatus(200);
        })
        .catch(() => {
            return res.sendStatus(400);
        })
});


router.get('/streaming', (req, res) => {
    const p = path.resolve(__dirname, '../', 'views', 'roverstream.html');
    res.sendFile(p);
});


module.exports = router;