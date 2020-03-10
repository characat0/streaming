const { Router } = require("express");
const path = require("path");
const router = Router();

router.get('/', (req, res) => {

    //Agregar lo comentado como principal cuando haya base de datos
    //const p = path.resolve(__dirname, '../', 'views', 'login.html');

    const p = path.resolve(__dirname, '../', 'views', 'stream.html');
    res.sendFile(p);
});


//router.get('/streamingerc', (req, res) => {
//    const p = path.resolve(__dirname, '../', 'views', 'stream.html');
//    res.sendFile(p);
//});


module.exports = router;