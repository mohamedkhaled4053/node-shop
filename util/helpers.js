const path = require('path');
const fs = require('fs');
const Product = require('../models/product');

exports.rootDir = path.dirname(process.mainModule.filename);

const productsPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const cartPath = path.join(require.main.filename, '..', 'data', 'cart.json');

exports.getDataFromFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, fileContent) => {
      let data = [];
      if (!err) {
        data = JSON.parse(fileContent);
      }
      resolve(data);
    });
  });
};
// exports.getDataFromFile = (path, cb) => {
//   fs.readFile(path, (err, fileContent) => {
//     let data = [];
//     if (!err) {
//       data = JSON.parse(fileContent);
//     }
//     cb(data);
//   });
// };

exports.writeFileContent = (path, data) => {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    console.log(err);
  });
};

exports.deleteFrom = (model, id, type) => {
  model.fetchAll().then(([data]) => {
    let newProducts = data.filter((product) => product.id !== id);
    let path = type === 'Product' ? productsPath : cartPath;
    this.writeFileContent(path, newProducts);
  });
};
