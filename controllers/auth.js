const { User } = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', { pageTitle: 'login', path: '/login' });
};

exports.postLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/login');
    }
    let isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'signup',
    path: '/signup',
  });
};

exports.postSignup = async (req, res, next) => {
  let { email, password, confirmPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.redirect('/signup');
    }
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUser = new User({ email, password: hashedPassword, cart: [] });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
};
