const { Router } = require('express');
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
} = require('../controllers/auth');

let router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/reset', getReset);

module.exports = router;
