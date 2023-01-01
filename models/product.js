const Sequelize = require('sequelize')
const sequelize = require('../util/database')


const Product = sequelize.define('product',{
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true, 
    autoIncrement: true,
    allowNull: false
  },
  title: Sequelize.STRING,
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description:{
    type : Sequelize.STRING,
    allowNull: false
  }
})


module.exports = Product



// const db = require('../util/database');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this.id = id ? id : Math.random().toString();
//   }

//   save() {
//     return db.execute(
//       'INSERT INTO products (title, imageUrl, description, price) VALUES (?,?,?,?)',
//       [this.title, this.imageUrl, this.description, this.price]
//     );
//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static fetchProduct(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
//   }

//    updateProduct(id) {
//     // edit products data
//     db.execute('UPDATE products SET title = ?, price = ? ,description= ?, imageUrl = ? WHERE products.id = ?',[this.title,this.price,this.description,this.imageUrl,id])
//     // edit cart data
//     db.execute('UPDATE products SET title = ?, price = ? ,description= ?, imageUrl = ? WHERE products.id = ?',[this.title,this.price,this.description,this.imageUrl,id])
//     
//   }

//   static deleteProduct(id) {

//     return db.execute('DELETE FROM products WHERE products.id = ?',[id])

//   }
// };
