const fs = require('fs');
const path = require('path');
const {
  getDataFromFile,
  writeFileContent,
  deleteFrom,
} = require('../util/helpers');
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
    getDataFromFile(productsPath).then((products) => {
      products.push(this);
      writeFileContent(productsPath, products);
    });
  }

  static fetchAll() {
    return getDataFromFile(productsPath)
  }

  static fetchProduct(id) {
    return getDataFromFile(productsPath).then((products) => {
      let product = products.find((product) => product.id === id);
      return product
    });
  }

  updateProduct() {
    // edit products data
    Product.fetchAll().then((products) => {
      let productIndex = products.findIndex((prod) => prod.id === this.id);
      products[productIndex] = this;
      writeFileContent(productsPath, products);
    });
    // edit cart data
    Cart.fetchAll().then((cart) => {
      let cartIndex = cart.findIndex((prod) => prod.id === this.id);
      if (cartIndex !== -1) {
        cart[cartIndex] = { ...this, amount: cart[cartIndex].amount };
        writeFileContent(cartPath, cart);
      }
    });
  }

  static deleteProduct(id) {
    deleteFrom(Product, id, 'Product');
    deleteFrom(Cart, id, 'Cart');
  }
};
