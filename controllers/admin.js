const { validationResult } = require('express-validator');
const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
    oldInput: null,
    errorMsgs:null
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price } = req.body;
  let imageUrl = req.file
  console.log(imageUrl);
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      edit: false,
      errorMsgs: errors.array().map((error) => error.msg),
      oldInput: { title, imageUrl, description,price },
    });
  }
  let product = new Product({
    title,
    imageUrl,
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
      let error = new Error(err)
      error.httpStatusCode= 500
      return next(err)
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId:req.user._id}).then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.findOne({_id:req.params.id, userId: req.user._id}).then((product) => {
    if (!product) {
      return res.redirect('/products/' + req.params.id);
    }
    res.render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      product,
      errorMsgs: null
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  let id = req.params.id;
  let { title, imageUrl, description, price } = req.body;
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      errorMsgs: errors.array().map((error) => error.msg),
      product: {_id:id, title, imageUrl, description,price },
    });
  }
  Product.findOneAndUpdate({_id:id,userId: req.user._id}, { title, imageUrl, description, price }).then(
    () => {
      res.redirect('/admin/products');
    }
  );
};

exports.postDeleteProduct = (req, res) => {
  let id = req.params.id;
  Product.findOneAndDelete({_id:id, userId:req.user._id}).then(() => {
    res.redirect('/admin/products');
  });
};
