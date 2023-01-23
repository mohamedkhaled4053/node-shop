const { Router } = require('express');
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');
const { signupValidation, loginValidation } = require('../validation/validation');

let router = Router();

router.get('/login', getLogin);
router.post('/login',loginValidation, postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post('/signup', signupValidation, postSignup);
router.get('/reset', getReset);
router.post('/reset', postReset);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = router;
