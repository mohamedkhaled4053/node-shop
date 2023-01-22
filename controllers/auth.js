const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const sendEmail = require('../util/sendEmail');
const crypto = require('crypto');

exports.getLogin = (req, res, next) => {
  let errorMsg = req.flash('error');
  errorMsg = errorMsg.length > 0 ? errorMsg[0] : null;
  res.render('auth/login', { pageTitle: 'login', path: '/login', errorMsg });
};

exports.postLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
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
  let errorMsg = req.flash('error');
  errorMsg = errorMsg.length > 0 ? errorMsg[0] : null;
  res.render('auth/signup', {
    pageTitle: 'signup',
    path: '/signup',
    errorMsg,
  });
};

exports.postSignup = async (req, res, next) => {
  let { email, password, confirmPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'this user already used for other user');
      return res.redirect('/signup');
    }
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


exports.getNewPassword = (req,res)=>{
  let errorMsg = req.flash('error');
  errorMsg = errorMsg.length > 0 ? errorMsg[0] : null;

  res.render('auth/new-password', {
    pageTitle: 'newPassword',
    path: '/newpassword',
    errorMsg,
  });
}

exports.postNewPassword = (req,res)=>{
  console.log('dd');
  res.redirect('/login')
}