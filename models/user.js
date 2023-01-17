const { model, Schema, Types } = require('mongoose');
const Order = require('./order');

const { Product } = require('./product');

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: { type: Types.ObjectId, ref: 'Product' },
      amount: Number,
    },
  ],
});

function addToCart(productId) {
  return Product.findById(productId).then((product) => {
    // check if we have product in cart
    let cartItemIndex = this.cart.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );
    if (cartItemIndex != -1) {
      // if we have it then increase the amount
      this.cart[cartItemIndex].amount++;
    } else {
      // if we don't have it then add it
      this.cart.push({ productId: product._id, amount: 1 });
    }
    return this.save();
  });
}

function getCart() {
  return this.populate('cart.productId').then((user) => {
    console.log(user.cart);
    return user.cart;
  });
}

function deleteCartItem(id) {
  this.cart = this.cart.filter((item) => item.productId.toString() !== id);
  return this.save();
}

function addOrder() {
  return this.getCart()
    .then((prodcuts) => {
      let order = new Order({
        items: prodcuts,
        user: {
          _id: this._id,
          name: this.name,
        },
      });
      return order.save()
    })
    // .then(() => {
    //   return getDb()
    //     .collection('users')
    //     .updateOne({ _id: this._id }, { $set: { cart: [] } });
    // });
}

function getOrders() {
  return Order.find({ 'user._id': this._id })
}

userSchema.methods = { addToCart, getCart, deleteCartItem, addOrder, getOrders };

let User = model('User', userSchema);

module.exports = { User };

// const { ObjectId } = require('mongodb');
// const { getDb } = require('../util/database');
// const {Product} = require('./product');

// class User {
//   constructor(id, name, email, cart) {
//     this._id = id ? id : new ObjectId();
//     this.name = name;
//     this.email = email;
//     this.cart = cart ? cart : [];
//   }

//   save() {
//     return getDb().collection('Users').insertOne(this);
//   }

//   addToCart(productId) {
//     return Product.fetchProduct(productId).then((product) => {
//       // check if we have product in cart
//       let cartItemIndex = this.cart.findIndex(
//         (item) => item.productId.toString() === product._id.toString()
//       );
//       let updatedCart = [...this.cart];
//       if (cartItemIndex != -1) {
//         // if we have it then increase the amount
//         updatedCart[cartItemIndex].amount++;
//       } else {
//         // if we don't have it then add it
//         updatedCart.push({ productId: product._id, amount: 1 });
//       }
//       return getDb()
//         .collection('users')
//         .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     });
//   }

//   getCart() {
//     let productIds = this.cart.map((item) => item.productId);
//     return getDb()
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => {
//           let amount = this.cart.find(
//             (cartItem) => prod._id.toString() === cartItem.productId.toString()
//           ).amount;
//           return { ...prod, amount };
//         });
//       });
//   }

//   static findById(id) {
//     return getDb()
//       .collection('users')
//       .findOne({ _id: ObjectId(id) })
//       .then((user) => {
//         let { _id, name, email, cart } = user;
//         let userObj = new User(_id, name, email, cart);
//         return userObj;
//       });
//   }

//   deleteCartItem(id) {
//     let updatedCart = this.cart.filter(
//       (item) => item.productId.toString() !== id
//     );
//     return getDb()
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   addOrder() {
//     return this.getCart()
//       .then((prodcuts) => {
//         let order = {
//           items: prodcuts,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         };
//         return getDb().collection('orders').insertOne(order);
//       })
//       .then(() => {
//         return getDb()
//           .collection('users')
//           .updateOne({ _id: this._id }, { $set: { cart: [] } });
//       });
//   }

//   getOrders() {
//     return getDb()
//       .collection('orders')
//       .find({ 'user._id': this._id })
//       .toArray();
//   }
// }

// module.exports = User;
