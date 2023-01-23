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
const { check, body } = require('express-validator');

let router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('email is not valid')
      .custom((email, { req }) => {
        if (email === 'test@gmail.com') {
          throw Error('this froppedin');
        }
        return true;
      }),
    body('password')
      .isAlphanumeric()
      .withMessage('password only contains numbers and letters')
      .isLength({ min: 3 })
      .withMessage('password minimum length is 3'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw Error('make sure that the password match cofirm password field');
      }
      return true;
    }),
  ],
  postSignup
);
router.get('/reset', getReset);
router.post('/reset', postReset);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = router;
