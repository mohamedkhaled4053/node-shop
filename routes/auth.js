const { Router } = require("express");
const { getLogin } = require("../controllers/auth");

let router = Router()

router.get('/login',getLogin)

module.exports = router