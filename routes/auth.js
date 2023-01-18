const { Router } = require("express");
const { getLogin, postLogin, postLogout } = require("../controllers/auth");

let router = Router()

router.get('/login',getLogin)
router.post('/login',postLogin)
router.post('/logout',postLogout)

module.exports = router