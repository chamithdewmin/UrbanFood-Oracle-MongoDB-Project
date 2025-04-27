const express = require('express');
const { createOrderWithCustomer } = require('../controllers/placeOrderController');
const router = express.Router();

router.post('/', createOrderWithCustomer);

module.exports = router;
