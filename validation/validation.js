const { check, body } = require('express-validator');
const { User } = require('../models/user');

let signupValidation = [
  check('email')
    .isEmail()
    .withMessage('email is not valid')
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject('this user already used for other user');
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
];

module.exports = { signupValidation };
