const express = require('express');
const { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem } = require('../controllers/orderItemController');
const router = express.Router();

router.get('/', getOrderItems);
router.post('/', createOrderItem);
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

module.exports = router;
