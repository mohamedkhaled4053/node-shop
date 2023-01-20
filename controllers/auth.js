const { User } = require('../models/user');

exports.getLogin = (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn;
  res.render('auth/login', { pageTitle: 'login', path: '/login', isLoggedIn });
};

exports.postLogin = (req, res, next) => {
  User.findById('63c582f725b4b033fc93ef8a')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn;
  res.render('auth/signup', {
    pageTitle: 'signup',
    path: '/signup',
    isLoggedIn,
  });
};

exports.postSignup = async (req, res, next) => {
  let { email, password, confirmPassword } = req.body;
  let user = await User.findOne({email})
  if (user) {
    return res.redirect('/signup');
  }
  let newUser = new User({ email, password, cart: [] });
  await newUser.save();
  res.redirect('/login')
};
