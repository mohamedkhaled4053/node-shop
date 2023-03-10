const { validationResult } = require('express-validator');
const { Product } = require('../models/product');
const { deleteFile } = require('../util/file');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
    oldInput: null,
    errorMsgs: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price } = req.body;
  let image = req.file;
  console.log(image);
  let errors = validationResult(req);
  if (!errors.isEmpty() || !image) {
    let errorMsgs = errors.array().map((error) => error.msg);
    if (!image) errorMsgs.push('image is required');
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      edit: false,
      errorMsgs,
      oldInput: { title, description, price, image },
    });
  }
  let product = new Product({
    title,
    imageUrl: image.path,
    description,
    price,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id, userId: req.user._id }).then(
    (product) => {
      if (!product) {
        return res.redirect('/products/' + req.params.id);
      }
      res.render('admin/add-product', {
        pageTitle: 'edit Product',
        path: '/admin/edit-product',
        edit: true,
        product,
        errorMsgs: null,
      });
    }
  );
};

exports.postEditProduct = (req, res, next) => {
  let id = req.params.id;
  let { title, description, price } = req.body;
  let image = req.file;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      errorMsgs: errors.array().map((error) => error.msg),
      product: { _id: id, title, description, price },
    });
  }

  Product.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { title, imageUrl: image && image.path, description, price }
  ).then((oldProduct) => {
    if(image) deleteFile(oldProduct.imageUrl)
    res.redirect('/admin/products');
  });
};

exports.postDeleteProduct = (req, res) => {
  let id = req.params.id;
  Product.findOneAndDelete({ _id: id, userId: req.user._id }).then(
    (deletedProduct) => {
      deleteFile(deletedProduct.imageUrl);
      req.user.deleteCartItem(id).then(() => res.redirect('/admin/products'));
    }
  );
};
