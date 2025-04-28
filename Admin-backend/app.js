// Import required modules
const express = require('express');
const cors = require('cors');

// Import route modules
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes'); // Correct the file name capitalization if needed
const paymentRoutes = require('./routes/paymentRoutes');
const placeOrderRoutes = require('./routes/placeOrderRoutes'); // For full order creation (customer + order + items)

// Initialize Express App
const app = express();
const PORT = 3000; // Change port here if needed

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// API Routes (Group all your routes under /api)
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/create-order', placeOrderRoutes); // Full order creation route

// Default Home Route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to UrbanFood Backend API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running successfully at: http://localhost:${PORT}`);
});
