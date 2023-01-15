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
      // check if we have product in cart
      let cartItemIndex = this.cart.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );
      let updatedCart = [...this.cart];
      if (cartItemIndex != -1) {
        // if we have it then increase the amount
        updatedCart[cartItemIndex].amount++;
      } else {
        // if we don't have it then add it
        updatedCart.push({ productId: product._id, amount: 1 });
      }
      return getDb()
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    });
  }

  getCart() {
    let productIds = this.cart.map((item) => item.productId);
    return getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          let amount = this.cart.find(
            (cartItem) => prod._id.toString() === cartItem.productId.toString()
          ).amount;
          return { ...prod, amount };
        });
      });
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: ObjectId(id) }).then(user=> {
        let { _id, name, email, cart } = user;
        let userObj = new User(_id, name, email, cart);
        return userObj
      })
  }
}

module.exports = User;
