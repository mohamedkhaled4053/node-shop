const { getDb } = require("../util/database");

module.exports = class Product {
  constructor( title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {

  }

  static fetchAll() {

  }

  static fetchProduct(id) {

  }

   updateProduct(id) {

  }

  static deleteProduct(id) {

  }
};
