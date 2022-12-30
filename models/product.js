const fs = require('fs');
const path = require('path');
const { getDataFromFile, writeFileContent } = require('../util/helpers');
const Cart = require('./cart');

const productsPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const cartPath = path.join(require.main.filename, '..', 'data', 'cart.json');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id ? id : Math.random().toString();
  }

  save() {
    getDataFromFile(productsPath, (products) => {
      products.push(this);
      writeFileContent(productsPath, products);
    });
  }

  static fetchAll(cb) {
    getDataFromFile(productsPath, cb);
  }

  static fetchProduct(id, cb) {
    getDataFromFile(productsPath, (products) => {
      let product = products.find((product) => product.id === id);
      cb(product);
    });
  }

  updateProduct() {
    // edit products data
    Product.fetchAll((products) => {
      let productIndex = products.findIndex((prod) => prod.id === this.id);
      products[productIndex] = this;
      writeFileContent(productsPath, products);
    });
    // edit cart data
    Cart.fetchCart((cart) => {
      let cartIndex = cart.findIndex((prod) => prod.id === this.id);
      cart[cartIndex] = { ...this, amount: cart[cartIndex].amount };
      writeFileContent(cartPath, cart);
    });
  }

  static deleteProduct(id) {
    Product.fetchAll((products) => {
      let newProducts = products.filter((product) => product.id !== id);
      writeFileContent(productsPath, newProducts);
    });
  }
};
