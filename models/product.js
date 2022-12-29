const fs = require('fs');
const path = require('path');
const { getDataFromFile } = require('../util/helpers');

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
    this.id = Math.random().toString()
  }

  save() {
    getDataFromFile(productsPath,products => {
      products.push(this);
      fs.writeFile(productsPath, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }
  
  static fetchAll(cb) {
    getDataFromFile(productsPath,cb);
  }

  static fetchProduct(id,cb){
    getDataFromFile(productsPath,(products)=>{
      let product = products.find(product => product.id === id)
      cb(product)
    })
  }

};
