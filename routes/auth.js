const { Router } = require("express");
const { getLogin, postLogin } = require("../controllers/auth");

let router = Router()

router.get('/login',getLogin)
router.post('/login',postLogin)

module.exports = router