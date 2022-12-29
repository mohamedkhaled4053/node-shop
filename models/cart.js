const path = require('path');
const fs = require('fs');
const { getDataFromFile } = require('../util/helpers');

const cartPath = path.join(require.main.filename, '..', 'data', 'cart.json');

module.exports = class Cart {
  static addToCart(product) {
    getDataFromFile(cartPath, (cart) => {
      // see if we have the product in cart
      let existed = cart.find((p) => p.id === product.id);
      // increase amount if we have it
      if (existed) {
        let index = cart.indexOf(existed)
        existed.amount ++
        cart[index] = existed
      } else {
        // if we don't have it add it
        cart.push({...product, amount: 1})
      }
      
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static fetchCart(cb) {
    getDataFromFile(cartPath, cb);
  }
};
