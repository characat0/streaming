const { Router } = require("express");
const router = Router();

router.get('/', (req, res) => {
    return res.sendStatus(200);
});

module.exports = router;