exports.getLogin = (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn
  res.render('auth/login', { pageTitle: 'login', path: '/login', isLoggedIn });
};
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  res.redirect('/')
};
