let express = require('express'); 
const { dirname } = require('path');
let path = require('path')

let router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname,'..','views','shop.html'))
});

module.exports = router;
