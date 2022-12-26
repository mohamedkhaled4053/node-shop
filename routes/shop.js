let express = require('express'); 
let path = require('path')
let rootDir = require('../utils/path')
let router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir,'views','shop.html'))
});

module.exports = router;
