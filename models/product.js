const { getDb } = require("../util/database");

module.exports = class Product {
  constructor( title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    let db = getDb()
    return db.collection('products').insertOne(this)
  }

  static fetchAll() {
    let db = getDb()
    return db.collection('products').find().toArray()
  }

  static fetchProduct(id) {

  }

   updateProduct(id) {

  }

  static deleteProduct(id) {

  }
};
