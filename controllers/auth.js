exports.getLogin = (req, res, next) => {
  isLoggedIn = req.get('Cookie').split('=')[1] === 'true'
  res.render('auth/login', { pageTitle: 'login', path: '/login', isLoggedIn });
};
exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true')
  res.redirect('/')
};
