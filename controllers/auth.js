const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const sendgridMail = require('@sendgrid/mail')

sendgridMail.setApiKey('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')

exports.getLogin = (req, res, next) => {
  let errorMsg = req.flash('error')
  errorMsg = errorMsg.length > 0 ? errorMsg[0]: null
  res.render('auth/login', { pageTitle: 'login', path: '/login',errorMsg});
};

exports.postLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid username or password')
      return res.redirect('/login');
    }
    let isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      req.flash('error', 'Invalid username or password')
      return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/');
    });
  } catch (error) {
    req.flash('error', 'something went wrong')
    res.redirect('/login')
    console.log(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let errorMsg = req.flash('error')
  errorMsg = errorMsg.length > 0 ? errorMsg[0]: null
  res.render('auth/signup', {
    pageTitle: 'signup',
    path: '/signup',
    errorMsg
  });
};

exports.postSignup = async (req, res, next) => {
  let { email, password, confirmPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'this user already used for other user')
      return res.redirect('/signup');
    }
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUser = new User({ email, password: hashedPassword, cart: [] });
    await newUser.save();
    await sendgridMail.send({
      to: email,
      from: 'mohamedkhaled4053@gmail.com',
      subject: 'welcome to shop',
      html: '<h1>you successfully signedup</h1>'
    })
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'something went wrong')
    res.redirect('/signup')
    console.log(error);
  }
};

exports.getReset = (req, res, next) => {
  let errorMsg = req.flash('error')
  errorMsg = errorMsg.length > 0 ? errorMsg[0]: null
  res.render('auth/reset', {
    pageTitle: 'reset',
    path: '/reset',
    errorMsg
  });
};
