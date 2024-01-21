
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
