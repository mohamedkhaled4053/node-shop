const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const sendEmail = require('../util/sendEmail');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  let errorMsgs = req.flash('error');
  errorMsgs = errorMsgs.length > 0 ? errorMsgs : null;
  res.render('auth/login', {
    pageTitle: 'login',
    path: '/login',
    errorMsgs,
    oldInput: null,
  });
};  

exports.postLogin = async (req, res, next) => {
  let { email, password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      pageTitle: 'login',
      path: '/login',
      errorMsgs: errors.array().map((error) => error.msg),
      oldInput: { email, password },
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
    let isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/');
    });
  } catch (error) {
    req.flash('error', 'something went wrong');
    res.redirect('/login');
    console.log(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let errorMsgs = req.flash('error');
  errorMsgs = errorMsgs.length > 0 ? errorMsgs : null;
  res.render('auth/signup', {
    pageTitle: 'signup',
    path: '/signup',
    errorMsgs,
    oldInput: null,
  });
};

exports.postSignup = async (req, res, next) => {
  let { email, password, confirmPassword } = req.body;
  let errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'signup',
      path: '/signup',
      errorMsgs: errors.array().map((error) => error.msg),
      oldInput: { email, password, confirmPassword },
    });
  }
  try {
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUser = new User({ email, password: hashedPassword, cart: [] });
    await newUser.save();
    res.redirect('/login');
    await sendEmail(
      email,
      'welcome to shop',
      '<h1>you successfully signed up</h1>'
    );
  } catch (error) {
    req.flash('error', 'something went wrong');
    res.redirect('/signup');
    console.log(error);
  }
};

exports.getReset = (req, res, next) => {
  let errorMsg = req.flash('error');
  errorMsg = errorMsg.length > 0 ? errorMsg[0] : null;
  res.render('auth/reset', {
    pageTitle: 'reset',
    path: '/reset',
    errorMsg,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', "this user doesn't exist");
      return res.redirect('/reset');
    }
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return console.log(err);
      }
      let token = buffer.toString('hex');
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      sendEmail(
        req.body.email,
        'reset password',
        `<p>
          click
          <a href="http://localhost:3000/reset/${token}">this link</a>
          to reset your password
        </p>
        <p>if you didn't try to reset your password then ignore this email</p>
      `
      );
      return res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getNewPassword = async (req, res) => {
  let errorMsg = req.flash('error');
  errorMsg = errorMsg.length > 0 ? errorMsg[0] : null;

  let user = await User.findOne({ resetToken: req.params.token }).catch((err) =>
    console.log(err)
  );

  if (!user) {
    errorMsg = 'this token is not valid';
  } else if (user && user.resetTokenExpiration < Date.now()) {
    errorMsg = 'this token is not valid any more';
  }

  res.render('auth/new-password', {
    pageTitle: 'newPassword',
    path: '/newpassword',
    errorMsg,
    user,
    token: user.resetToken,
  });
};

exports.postNewPassword = async (req, res) => {
  let hashedPassword = await bcrypt.hash(req.body.password, 12);
  await User.findOneAndUpdate(
    {
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExpiration: { $gt: Date.now() },
    },
    { password: hashedPassword, resetTokenExpiration: Date.now() }
  );
  res.redirect('/login');
};
