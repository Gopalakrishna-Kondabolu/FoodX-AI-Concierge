const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // Starters, Main Course, Beverages, Desserts
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  description: { type: String },
  spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
