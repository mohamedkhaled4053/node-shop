
const express = require('express');

const { getShop } = require('../controllers/products');

const router = express.Router();

router.get('/', getShop);

module.exports = router;
