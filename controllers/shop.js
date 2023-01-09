const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(req.params.id).then((product) => {
    res.render('shop/product-detail.ejs', {
      pageTitle: product ? product.title : 'not found',
      path: '/products',
      product,
    });
  });
};

exports.addToCart = (req, res, next) => {
  Product.findByPk(req.body.id).then((product) => {
    Cart.addToCart(product);
  });

  res.redirect('/cart');
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    cart.getProducts().then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        cart: products,
      });
    }).catch(err=>{
      console.log(err);
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
