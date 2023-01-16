// const { ObjectId } = require('mongodb');
// const { getDb } = require('../util/database');

// module.exports = class Product {
//   constructor(title, imageUrl, description, price, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this.userId = userId;
//   }

//   save() {
//     return getDb().collection('products').insertOne(this);
//   }

//   static fetchAll() {
//     return getDb().collection('products').find().toArray();
//   }

//   static fetchProduct(id) {
//     return getDb()
//       .collection('products')
//       .findOne({ _id: new ObjectId(id) });
//   }

//   update(id) {
//     return getDb()
//       .collection('products')
//       .updateOne({ _id: new ObjectId(id) }, { $set: this });
//   }

//   static deleteProduct(id) {
//     return getDb()
//       .collection('products')
//       .deleteOne({ _id: new ObjectId(id) });
//   }
// };
