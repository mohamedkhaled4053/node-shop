const path = require('path');

const express = require('express');

const {
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProducts,
  getProduct,
} = require('../controllers/shop');
const Product = require('../models/product');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getProduct);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

module.exports = router;
