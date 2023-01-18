exports.getLogin = (req, res, next) => {
  res.render('auth/login', { pageTitle: 'login', path: '/login', isLoggedIn : req.isLoggedIn });
};
exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true
  res.redirect('/')
};
