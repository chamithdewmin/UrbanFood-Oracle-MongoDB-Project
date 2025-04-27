const express = require('express');
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Routes
router.post('/orders', placeOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

module.exports = router;
