const { check, body } = require('express-validator');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');

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

let loginValidation = [
  check('email').custom(async (email, { req }) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return Promise.reject('Invalid email or password');
      }
      let isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isCorrectPassword) {
        return Promise.reject('Invalid email or password');
      }
      req.loggedInUser = user;
      return true;
    } catch (error) {
      console.log(error);
      throw Error('something went wrong');
    }
  }),
];

let addProductValidation = [
  check('title').notEmpty().withMessage('title is required'),
  check('price').isFloat().withMessage('price should be float number'),
  check('description').notEmpty().withMessage('description is required'),
];

module.exports = { signupValidation, loginValidation, addProductValidation };
