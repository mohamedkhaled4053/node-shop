const fs = require('fs');
const path = require('path');
const { rootDir } = require('../util/path');

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    let dataPath = path.join(rootDir, 'data', 'products.json');
    fs.readFile(dataPath, (err, fileData) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileData);
      }

      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }

  static fetchAll(cb) {
    let dataPath = path.join(rootDir, 'data', 'products.json');

    fs.readFile(dataPath, (err, fileData) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileData);
      }
      cb(products);
    });
  }
}

module.exports = { Product };
