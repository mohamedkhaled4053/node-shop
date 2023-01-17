const {Product} = require('../models/product');
const {User} = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id).then((product) => {
    res.render('shop/product-detail.ejs', {
      pageTitle: product ? product.title : 'not found',
      path: '/products',
      product,
    });
  });
};

exports.addToCart = (req, res, next) => {
  req.user.addToCart(req.body.id).then(() => {
    res.redirect('/cart');
  });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart,
    });
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.deleteCartItem = (req, res) => {
  req.user.deleteCartItem(req.body.id).then(() => res.redirect('/cart'));
};

exports.createOrder = (req, res) => {
  req.user.addOrder().then(() => res.redirect('/orders'));
};
