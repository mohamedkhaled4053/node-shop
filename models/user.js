const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');
const Product = require('./product');

class User {
  constructor(id, name, email, cart) {
    this._id = id ? id : new ObjectId();
    this.name = name;
    this.email = email;
    this.cart = cart ? cart : [];
  }

  save() {
    return getDb().collection('Users').insertOne(this);
  }

  addToCart(productId) {
    return Product.fetchProduct(productId).then((product) => {
      let updatedCart = [...this.cart, { ...product, amount: 1 }];
      return getDb()
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    });
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: ObjectId(id) });
  }
}

module.exports = User;
