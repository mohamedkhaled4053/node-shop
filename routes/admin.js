let express = require('express');
let path = require('path');
let rootDir = require('../utils/path')

let router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','add-product.html'))
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
