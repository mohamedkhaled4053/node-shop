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
  getInvoice,
} = require('../controllers/shop');
const isAuth = require('../middleware/isauth');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getProduct);

router.post('/add-to-cart',isAuth, addToCart);

router.get('/cart',isAuth, getCart);

router.get('/orders',isAuth, getOrders);

router.get('/checkout',isAuth, getCheckout);

router.post('/delete-cart-product',isAuth, deleteCartItem);

router.get('/checkout/cancel',isAuth, getCheckout);

router.get('/checkout/success',isAuth, createOrder);

router.get('/orders/:orderId',isAuth, getInvoice)

router.get('/orders/:orderId',isAuth, getInvoice)

module.exports = router;
