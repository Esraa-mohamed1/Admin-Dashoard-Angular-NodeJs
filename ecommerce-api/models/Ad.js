const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: String
  }, { timestamps: true });
  
  module.exports = mongoose.model('Ad', AdSchema);
  