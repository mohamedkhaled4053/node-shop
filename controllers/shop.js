const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchProduct(req.params.id).then((product) => {
    res.render('shop/product-detail.ejs', {
      pageTitle: product ? product.title : 'not found',
      path: '/products',
      product,
    });
  });
};

exports.addToCart = (req, res, next) => {
  let {_id , name, email, cart} = req.user
  let updatedUser = new User(_id,name, email ,cart)
  updatedUser.addToCart(req.body.id).then(() => {
    res.redirect('/cart');
  });

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: req.body.id } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products > 0) {
  //       product = products[0];
  //     }
  //     let newQuantity = 1;
  //     if (product) {
  //       // ...
  //     }

  //     return Product.findByPk(req.body.id)
  //       .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //           through: { amount: newQuantity },
  //         });
  //       })
  //       .then(() => {
  //         res.redirect('/cart');
  //       });
  //   });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  let {_id , name, email, cart} = req.user
  let user = new User(_id,name, email ,cart)

  user.getCart().then(products=>{
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart: products,
    });

  })
  
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
