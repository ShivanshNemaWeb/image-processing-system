const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  compressedUrl: String,
});

const productSchema = new mongoose.Schema({
  serialNumber: Number,
  productName: String,
  images: [imageSchema],
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  requestId : String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
