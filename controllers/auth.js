const { User } = require("../models/user");

exports.getLogin = (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn
  res.render('auth/login', { pageTitle: 'login', path: '/login', isLoggedIn });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  User.findById('63c582f725b4b033fc93ef8a')
  .then((user) => {
    req.session.user = user;
    res.redirect('/')
  })
  .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(()=>{
    res.redirect('/')
  })
};
