const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([products, fieldData]) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.fetchProduct(req.params.id).then(([[product]]) => {
    if (!product) {
      return res.redirect('/products/' + req.params.id);
    }
    res.render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  let id = req.params.id;
  let { title, imageUrl, description, price } = req.body;
  let updatedProduct = new Product(id, title, imageUrl, description, price);
  updatedProduct.updateProduct();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  let id = req.params.id;
  Product.deleteProduct(id);
  res.redirect('/admin/products');
};
