const fs = require('fs');
const path = require('path');
const { getDataFromFile, writeFileContent } = require('../util/helpers');

const productsPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

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
    Product.fetchAll((products) => {
      let index = products.findIndex((product) => product.id === this.id);
      products[index] = this;

      writeFileContent(productsPath, products);
    });
  }

  static deleteProduct(id) {
    Product.fetchAll((products) => {
      let newProducts = products.filter((product) => product.id !== id);
      writeFileContent(productsPath, newProducts);
    });
  }
};
