const express = require('express');
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Order Routes
router.get('/orders', getOrders);             // GET all orders
router.get('/orders/:id', getOrderById);       // GET single order
router.post('/orders', placeOrder);            // POST new order
router.put('/orders/:id', updateOrderStatus);  // PUT update order status
router.delete('/orders/:id', deleteOrder);     // DELETE order

module.exports = router;
