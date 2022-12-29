const path = require('path');
const fs = require('fs');
const { getDataFromFile } = require('../util/helpers');

const cartPath = path.join(require.main.filename, '..', 'data', 'cart.json');

module.exports = class Cart {
  static addToCart(product) {
    getDataFromFile(cartPath, (cart) => {
      cart.push(product);

      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static fetchCart(cb) {
    getDataFromFile(cartPath, cb);
  }
};
