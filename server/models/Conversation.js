const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  customerPhone: { type: String, required: true },
  customerMessage: { type: String, required: true },
  botReply: { type: String, required: true },
  intent: { 
    type: String, 
    enum: ["menu_query", "order_status", "recommendation", "escalated", "escalation", "greeting", "other"],
    default: "other"
  },
  timestamp: { type: Date, default: Date.now },
  responseTimeMs: { type: Number }
});

module.exports = mongoose.model('Conversation', conversationSchema);
