const express = require('express');
const { getAllOrders, createOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

// Get all orders
router.get('/', getAllOrders);

// Create new order (if needed)
router.post('/', createOrder);

// Delete specific order
router.delete('/:id', deleteOrder);

module.exports = router;
