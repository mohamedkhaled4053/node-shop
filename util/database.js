const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

function mongoConnect(cb) {
  mongoClient
    .connect(
      'mongodb+srv://mongouser:mongo@cluster0.tmobxrw.mongodb.net/?retryWrites=true&w=majority'
    )
    .then((client) => {
      cb(client);
    })
    .catch((err) => console.log(err));
}

module.exports = {mongoConnect}