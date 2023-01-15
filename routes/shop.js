const path = require('path');

const express = require('express');

const {
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProducts,
  getProduct,
  addToCart,
  deleteCartItem,
} = require('../controllers/shop');
const Product = require('../models/product');
const Cart = require('../models/cart');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getProduct);

router.post('/add-to-cart', addToCart);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

router.post('/delete-cart-product', deleteCartItem);

module.exports = router;
