require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Conversation = require('./models/Conversation');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  mongoose.connection.once('open', () => {
  console.log('Connected to DB:', mongoose.connection.db.databaseName);
});

// --- Static Routes ---
app.get('/privacy', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; max-width: 800px; margin: 40px auto; padding: 20px;">
        <h1>Privacy Policy — FoodX AI Concierge</h1>
        <p>Last updated: June 2026</p>
        <p>This application collects WhatsApp messages solely to provide automated customer support responses. No personal data is stored beyond what is necessary to process your request. Data is not shared with third parties.</p>
        <p>Contact: gopal@foodxai.com</p>
      </body>
    </html>
  `);
});

// --- Menu Routes ---

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item availability
app.patch('/api/menu/:id', async (req, res) => {
  try {
    const { available } = req.body;
    const menuItem = await MenuItem.findOneAndUpdate(
      { id: req.params.id },
      { available },
      { new: true }
    );
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Order Routes ---

// Get single order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by customer phone
app.get('/api/orders/customer/:phone', async (req, res) => {
  try {
    const orders = await Order.find({ customerPhone: req.params.phone }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Conversation Routes ---

// Log a conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const newConv = new Conversation(req.body);
    const savedConv = await newConv.save();
    res.status(201).json(savedConv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ timestamp: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get conversation stats
app.get('/api/conversations/stats', async (req, res) => {
  try {
    const total = await Conversation.countDocuments();
    
    const intentCounts = await Conversation.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } }
    ]);

    const escalatedCount = await Conversation.countDocuments({ intent: 'escalated' });
    const escalationRate = total > 0 ? ((escalatedCount / total) * 100).toFixed(1) : 0;

    const avgTimeRes = await Conversation.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$responseTimeMs" } } }
    ]);
    const avgResponseTime = avgTimeRes.length > 0 ? Math.round(avgTimeRes[0].avgTime) : 0;

    res.json({
      totalConversations: total,
      intentCounts,
      escalationRate: parseFloat(escalationRate),
      averageResponseTimeMs: avgResponseTime
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
