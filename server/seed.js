require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Conversation = require('./models/Conversation');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set!");
  process.exit(1);
}

const menuItems = [
  { id: 'M001', name: 'Hyderabadi Chicken Dum Biryani', category: 'Main Course', price: 350, isVeg: false, description: 'Classic aromatic rice dish with slow-cooked chicken', spiceLevel: 2, available: true },
  { id: 'M002', name: 'Mutton Ghee Roast Biryani', category: 'Main Course', price: 450, isVeg: false, description: 'Spicy mutton biryani roasted in fresh ghee', spiceLevel: 3, available: true },
  { id: 'M003', name: 'Paneer Butter Masala', category: 'Main Course', price: 280, isVeg: true, description: 'Rich and creamy curry made with paneer, spices, onions, tomatoes', spiceLevel: 1, available: true },
  { id: 'M004', name: 'Gutti Vankaya Kura', category: 'Main Course', price: 220, isVeg: true, description: 'Stuffed eggplant curry, a traditional Andhra delicacy', spiceLevel: 2, available: true },
  { id: 'M005', name: 'Chicken 65', category: 'Starters', price: 250, isVeg: false, description: 'Spicy, deep-fried chicken dish originating from Chennai', spiceLevel: 3, available: true },
  { id: 'M006', name: 'Gobi 65', category: 'Starters', price: 180, isVeg: true, description: 'Crispy fried cauliflower florets tossed in spicy sauce', spiceLevel: 2, available: true },
  { id: 'M007', name: 'Apollo Fish', category: 'Starters', price: 320, isVeg: false, description: 'Spicy, tangy and crispy boneless fish starter', spiceLevel: 2, available: true },
  { id: 'M008', name: 'Chilli Paneer', category: 'Starters', price: 220, isVeg: true, description: 'Indo-Chinese appetizer where crisp batter fried paneer is tossed in slightly sweet, spicy, hot and tangy chilli sauce', spiceLevel: 2, available: true },
  { id: 'M009', name: 'Masala Dosa', category: 'Tiffins', price: 90, isVeg: true, description: 'Thin crepe made from a fermented batter of lentils and rice, filled with potato curry', spiceLevel: 1, available: true },
  { id: 'M010', name: 'Idli (3 Pcs)', category: 'Tiffins', price: 60, isVeg: true, description: 'Savory rice cake, originating from the Indian subcontinent', spiceLevel: 0, available: true },
  { id: 'M011', name: 'Pesarattu Upma', category: 'Tiffins', price: 120, isVeg: true, description: 'Moong dal dosa stuffed with upma, an Andhra specialty', spiceLevel: 1, available: true },
  { id: 'M012', name: 'Vada (2 Pcs)', category: 'Tiffins', price: 70, isVeg: true, description: 'Crispy, fluffy, soft and delicious lentil doughnuts', spiceLevel: 1, available: true },
  { id: 'M013', name: 'Double Ka Meetha', category: 'Desserts', price: 150, isVeg: true, description: 'Bread pudding Indian sweet of fried bread slices soaked in hot milk with spices', spiceLevel: 0, available: true },
  { id: 'M014', name: 'Qubani Ka Meetha', category: 'Desserts', price: 180, isVeg: true, description: 'Authentic Hyderabadi sweet made from dried apricots', spiceLevel: 0, available: true },
  { id: 'M015', name: 'Gulab Jamun (2 Pcs)', category: 'Desserts', price: 80, isVeg: true, description: 'Fried dough balls that are soaked in a sweet, sticky sugar syrup', spiceLevel: 0, available: true },
  { id: 'M016', name: 'Sweet Lassi', category: 'Beverages', price: 70, isVeg: true, description: 'Popular traditional dahi-based drink', spiceLevel: 0, available: true },
  { id: 'M017', name: 'Butter Milk (Majjiga)', category: 'Beverages', price: 40, isVeg: true, description: 'Refreshing drink made from yogurt and water', spiceLevel: 0, available: true },
  { id: 'M018', name: 'Filter Coffee', category: 'Beverages', price: 50, isVeg: true, description: 'South Indian filter coffee', spiceLevel: 0, available: true }
];

const mockOrders = [
  {
    orderId: 'ORD-1001',
    customerPhone: '+919876543210',
    customerName: 'Demo User 1',
    items: [
      { menuItemId: 'M001', name: 'Hyderabadi Chicken Dum Biryani', qty: 2, price: 350 },
      { menuItemId: 'M016', name: 'Sweet Lassi', qty: 2, price: 70 }
    ],
    status: 'out_for_delivery',
    totalAmount: 840,
    placedAt: new Date(Date.now() - 45 * 60000), // 45 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60000)
  },
  {
    orderId: 'ORD-1002',
    customerPhone: '+919876543210',
    customerName: 'Demo User 1',
    items: [
      { menuItemId: 'M009', name: 'Masala Dosa', qty: 1, price: 90 },
      { menuItemId: 'M018', name: 'Filter Coffee', qty: 1, price: 50 }
    ],
    status: 'delivered',
    totalAmount: 140,
    placedAt: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    estimatedDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000)
  },
  {
    orderId: 'ORD-1003',
    customerPhone: '+919123456789',
    customerName: 'Rahul Reddy',
    items: [
      { menuItemId: 'M005', name: 'Chicken 65', qty: 1, price: 250 },
      { menuItemId: 'M002', name: 'Mutton Ghee Roast Biryani', qty: 1, price: 450 }
    ],
    status: 'preparing',
    totalAmount: 700,
    placedAt: new Date(Date.now() - 15 * 60000), // 15 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000)
  },
  {
    orderId: 'ORD-1004',
    customerPhone: '+918000011111',
    customerName: 'Sneha Sharma',
    items: [
      { menuItemId: 'M003', name: 'Paneer Butter Masala', qty: 1, price: 280 },
      { menuItemId: 'M004', name: 'Gutti Vankaya Kura', qty: 1, price: 220 }
    ],
    status: 'placed',
    totalAmount: 500,
    placedAt: new Date(Date.now() - 5 * 60000), // 5 mins ago
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60000)
  },
  {
    orderId: 'ORD-1005',
    customerPhone: '+919876543211',
    customerName: 'Demo User 2',
    items: [
      { menuItemId: 'M007', name: 'Apollo Fish', qty: 1, price: 320 }
    ],
    status: 'cancelled',
    totalAmount: 320,
    placedAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
    estimatedDeliveryTime: new Date(Date.now() - 15 * 60000)
  }
];

const mockConversations = [
  {
    customerPhone: '+919876543210',
    customerMessage: 'Where is my order ORD-1001?',
    botReply: 'Your order ORD-1001 is currently out for delivery and should arrive in about 15 minutes. Our delivery partner is on the way!',
    intent: 'order_status',
    timestamp: new Date(Date.now() - 2 * 60000),
    responseTimeMs: 850
  },
  {
    customerPhone: '+919123456789',
    customerMessage: 'Do you have any vegetarian starters?',
    botReply: 'Yes, we have Gobi 65 (₹180) and Chilli Paneer (₹220) which are excellent vegetarian starters. Would you like me to add either to your order?',
    intent: 'menu_query',
    timestamp: new Date(Date.now() - 25 * 60000),
    responseTimeMs: 1200
  },
  {
    customerPhone: '+918000011111',
    customerMessage: 'I received the wrong item in my order',
    botReply: 'I sincerely apologize for the inconvenience. Let me connect you with a human agent who can resolve this issue immediately.',
    intent: 'escalated',
    timestamp: new Date(Date.now() - 50 * 60000),
    responseTimeMs: 950
  },
  {
    customerPhone: '+919876543211',
    customerMessage: 'What is the most popular biryani?',
    botReply: 'Our most popular dish is the Hyderabadi Chicken Dum Biryani (₹350), which is a classic! If you prefer something spicier, our Mutton Ghee Roast Biryani (₹450) is also highly recommended.',
    intent: 'recommendation',
    timestamp: new Date(Date.now() - 65 * 60000),
    responseTimeMs: 1500
  },
  {
    customerPhone: '+919876543210',
    customerMessage: 'Hi',
    botReply: 'Hello! Welcome to FoodX. How can I help you today? You can ask me about our menu, check an order status, or get recommendations.',
    intent: 'other',
    timestamp: new Date(Date.now() - 120 * 60000),
    responseTimeMs: 600
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Conversation.deleteMany({});
    console.log('Cleared existing data.');

    await MenuItem.insertMany(menuItems);
    console.log('Seeded menu items.');

    await Order.insertMany(mockOrders);
    console.log('Seeded orders.');

    await Conversation.insertMany(mockConversations);
    console.log('Seeded conversations.');

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
