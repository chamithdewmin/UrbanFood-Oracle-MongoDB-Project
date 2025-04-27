const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(cors());  
app.use(express.json());  

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);   // ✅ Only once

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
