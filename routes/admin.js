const path = require('path');

const express = require('express');

const {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin');
const { Product } = require('../models/product');
const isAuth = require('../middleware/isauth');
const { addProductValidation } = require('../validation/validation');

const router = express.Router();

// /admin route need authentication
router.use(isAuth)

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product',addProductValidation, postAddProduct);

// /admin/edit-product/:id?edit=true => GET
router.get('/edit-product/:id', getEditProduct);

// /admin/edit-product/:id => POST
router.post('/edit-product/:id', postEditProduct);

// /admin/edit-product/:id => POST
router.post('/delete-product/:id', postDeleteProduct);

module.exports = router;
