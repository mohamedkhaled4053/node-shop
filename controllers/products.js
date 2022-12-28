const { Product } = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProducts = (req, res, next) => {
  let product = new Product(req.body.title);
  product.save()

  res.redirect('/');
};

exports.getShop = (req, res, next) => {
    let products = Product.fetchAll((products=>{
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
          });
    }))

};
