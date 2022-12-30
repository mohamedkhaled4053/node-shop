const path = require('path');
const fs = require('fs');

exports.rootDir = path.dirname(process.mainModule.filename);

exports.getDataFromFile = (path, cb) => {
  fs.readFile(path, (err, fileContent) => {
    let data = [];
    if (!err) {
      data = JSON.parse(fileContent);
    }
    cb(data);
  });
};