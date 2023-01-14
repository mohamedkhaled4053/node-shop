const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    return getDb().collection('Users').insertOne(this);
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: ObjectId(id) })
  }
}

module.exports = User;
