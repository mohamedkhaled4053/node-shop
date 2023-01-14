const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db

function mongoConnect(cb) {
  mongoClient
    .connect(
      'mongodb+srv://mongouser:mongo@cluster0.tmobxrw.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then((client) => {
      _db = client.db()
      cb();
    })
    .catch((err) => console.log(err));
}


function getDb() {
  if (_db){
    return _db
  }
  throw 'no database found'
}
module.exports = {mongoConnect, getDb}