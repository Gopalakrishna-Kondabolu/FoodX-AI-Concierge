const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerPhone: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [{
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "placed"
  },
  totalAmount: { type: Number, required: true },
  placedAt: { type: Date, default: Date.now },
  estimatedDeliveryTime: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
