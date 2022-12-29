const fs = require('fs');
const path = require('path');

const productsPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const cartPath = path.join(require.main.filename,'..','data','cart.json')

function getDataFromFile(path, cb) {
  fs.readFile(path, (err, fileContent)=>{
    let data = []
    if (!err) {
      data = JSON.parse(fileContent)
    }
    cb(data)
  })
}

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
  static addToCart(product){
    getDataFromFile(cartPath,(cart)=>{
      cart.push(product)

      fs.writeFile(cartPath,JSON.stringify(cart),(err)=>{
        console.log(err);
      })
    })
  }


  static fetchCart(cb){
    getDataFromFile(cartPath, cb)
  }
};
