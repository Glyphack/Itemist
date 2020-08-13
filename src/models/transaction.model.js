const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product'
    },
    authority: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'Error Occured'],
    },
    amount: {
      type: Number,
    },
    refId: {
      type: String,
    }
  },
  {timestamps: true}
);

module.exports = {Transaction: mongoose.model('Transaction', transactionSchema)};
