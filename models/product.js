const fs = require('fs');
const path = require('path');
const { getDataFromFile, writeFileContent } = require('../util/helpers');

const productsPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = Math.random().toString();
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

  static updateProduct(id, reqBody) {
    Product.fetchAll((products) => {
      let { title, imageUrl, description, price } = reqBody;
      let unpdatedProduct = { id, title, imageUrl, description, price };
      let index = products.findIndex((p) => p.id === id);
      products[index] = unpdatedProduct;

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
