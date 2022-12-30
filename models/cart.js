const path = require('path');
const fs = require('fs');
const { getDataFromFile, writeFileContent } = require('../util/helpers');

const cartPath = path.join(require.main.filename, '..', 'data', 'cart.json');

module.exports = class Cart {
  static addToCart(product) {
    getDataFromFile(cartPath, (cart) => {
      // see if we have the product in cart
      let existed = cart.find((p) => p.id === product.id);
      // increase amount if we have it
      if (existed) {
        let index = cart.indexOf(existed);
        existed.amount++;
        cart[index] = existed;
      } else {
        // if we don't have it add it
        cart.push({ ...product, amount: 1 });
      }

      writeFileContent(cartPath, cart)
    });
  }

  static fetchCart(cb) {
    getDataFromFile(cartPath, cb);
  }

  static deleteProduct(id){
    Cart.fetchCart((cart) => {
      let newProducts = cart.filter((product) => product.id !== id);
      writeFileContent(cartPath, newProducts);
    });
  }
};
