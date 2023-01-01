const fs = require('fs');
const path = require('path');
const {
  getDataFromFile,
  writeFileContent,
  deleteFrom,
} = require('../util/helpers');
const Cart = require('./cart');

const db = require('../util/database');

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
    return db.execute(
      'INSERT INTO products (title, imageUrl, description, price) VALUES (?,?,?,?)',
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static fetchProduct(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
  }

   updateProduct(id) {
    // edit products data
    db.execute('UPDATE products SET title = ?, price = ? ,description= ?, imageUrl = ? WHERE products.id = ?',[this.title,this.price,this.description,this.imageUrl,id])
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
    // deleteFrom(Product, id, 'Product');
    return db.execute('DELETE FROM products WHERE products.id = ?',[id])
    // deleteFrom(Cart, id, 'Cart');
  }
};
