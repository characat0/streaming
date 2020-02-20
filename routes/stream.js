const { Router } = require("express");
const path = require("path");
const router = Router();

router.get('/', (req, res) => {
    const p = path.resolve(__dirname, '../', 'views', 'stream.html');
    res.sendFile(p);
});
module.exports = router;