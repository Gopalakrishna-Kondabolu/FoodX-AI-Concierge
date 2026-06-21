# FoodX AI Concierge

A MERN stack application built as a portfolio project to demonstrate an AI-powered WhatsApp customer assistant for a food delivery platform.

This repository contains two main components:
- `/server` - Node.js/Express REST API with MongoDB
- `/client` - React (Vite) Dashboard with Tailwind CSS

## Prerequisites

- Node.js (v18+ recommended)
- **MongoDB**: Must be running locally (`mongod` command or MongoDB service) on the default port `27017` before running the seed script or starting the server.

## Setup Instructions

### 1. Database & Backend

1. Open a terminal and navigate to the `/server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (already done by default, uses `mongodb://127.0.0.1:27017/foodx` and `PORT=5000`).
4. **Seed the database** (Ensure your local MongoDB is running!):
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *The API will be available at `http://localhost:5000`*

### 2. Frontend Dashboard

1. Open a new terminal and navigate to the `/client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173`*

## API Endpoints

The backend provides the following REST API endpoints:

**Menu**
- `GET /api/menu` - Returns all menu items.
- `PATCH /api/menu/:id` - Updates the availability of a menu item (expects `{ "available": boolean }`).

**Orders**
- `GET /api/orders/:orderId` - Returns details of a specific order.
- `GET /api/orders/customer/:phone` - Returns recent orders for a given phone number.
- `POST /api/orders` - Create a new order.

**Conversations (For n8n / AI integration)**
- `POST /api/conversations` - Logs a new conversation exchange between the AI bot and a customer.
- `GET /api/conversations` - Returns all conversation logs (used by the dashboard feed).
- `GET /api/conversations/stats` - Returns aggregate statistics for the dashboard overview.

## Integration Note

The n8n workflow (built separately) is what will call `POST /api/conversations` to log real WhatsApp exchanges, and `GET /api/orders` / `GET /api/menu` to answer customer queries. The backend API is designed to support these operations over plain HTTP.

## Demo Data Information

To assist with the live demo (e.g., testing the "where's my order" WhatsApp flow in n8n), the following specific phone numbers and orders have been seeded into the database:

- **Phone Number: `+919876543210`** (Demo User 1)
  - `ORD-1001` (Status: Out for Delivery)
  - `ORD-1002` (Status: Delivered)
- **Phone Number: `+919123456789`** (Rahul Reddy)
  - `ORD-1003` (Status: Preparing)
- **Phone Number: `+918000011111`** (Sneha Sharma)
  - `ORD-1004` (Status: Placed)
- **Phone Number: `+919876543211`** (Demo User 2)
  - `ORD-1005` (Status: Cancelled)
