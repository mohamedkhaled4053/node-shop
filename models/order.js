const { model, Schema, Types } = require('mongoose');

let orderSchema = new Schema({
  items: [
    {
      product: Object,
      amount: Number,
    },
  ],
  user: {
    _id: { type: Types.ObjectId, ref: 'User' },
    name: String,
  },
});

let Order = model('Order', orderSchema);

module.exports = Order;
