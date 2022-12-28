const fs = require('fs');
const path = require('path');
const { rootDir } = require('../util/path');

let dataPath = path.join(rootDir, 'data', 'products.json');
function handleFileData(cb) {
  fs.readFile(dataPath, (err, fileData) => {
    let products = [];
    if (!err) {
      products = JSON.parse(fileData);
    }
    cb(products);
  });
}

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    handleFileData((products) => {
      products.push(this);
      fs.writeFile(dataPath, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }

  static fetchAll(cb) {
    handleFileData(cb);
  }
}

module.exports = { Product };
