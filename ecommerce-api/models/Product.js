const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, 
  description: { type: String, trim: true }, 
  price: { type: Number, required: true, min: 0 }, 
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
  stock: { type: Number, default: 0, min: 0 }, 
  image: { type: String },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});



productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
