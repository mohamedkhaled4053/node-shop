const path = require('path');

const express = require('express');

const {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
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
router.get('/edit-product/:id', getEditProduct);

// /admin/edit-product/:id => POST
router.post('/edit-product/:id', postEditProduct);

module.exports = router;
