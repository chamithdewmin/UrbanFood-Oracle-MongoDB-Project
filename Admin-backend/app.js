// Import required modules
const express = require('express');
const cors = require('cors');

// Import route files
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderItemRoutes = require('./routes/OrderItemRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');
const placeOrderRoutes = require('./routes/placeOrderRoutes'); // 🔥 Add this for full order creation

// Initialize Express App
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/create-order', placeOrderRoutes); // 🔥 Add route for creating full order (customer + order + items)

// Default Home Route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to UrbanFood Backend API');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server running successfully at: http://localhost:${PORT}`);
});
