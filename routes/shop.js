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
  createOrder,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getProduct);

router.post('/add-to-cart', addToCart);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

router.post('/delete-cart-product', deleteCartItem);

router.post('/create-order', createOrder);

module.exports = router;
