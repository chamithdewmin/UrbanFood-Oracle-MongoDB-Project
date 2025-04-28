const express = require('express');
const { getAllOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

// Route mappings
router.get('/', getAllOrders);        // GET all orders
router.post('/', createOrder);        // (optional) POST create new order
router.put('/:id', updateOrder);       // PUT update order status
router.delete('/:id', deleteOrder);    // DELETE an order

module.exports = router;
