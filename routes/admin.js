const path = require('path');

const express = require('express');

const {
  getAddProduct,
  getProducts,
  postAddProduct,
} = require('../controllers/admin');
const Product = require('../models/product');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/edit-product/:id?edit=true => GET
router.get('/edit-product/:id', (req, res, next) => {
  Product.fetchProduct(req.params.id, (product) => {
    if(!product){
        return res.redirect('/products/'+req.params.id)
    }
    res.render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      product
    });
  });
});

// /admin/edit-product/:id => POST
router.post('/edit-product/:id', (req, res, next) => {
    Product.updateProduct(req.params.id,req.body)
    res.redirect('/products')
});

module.exports = router;
