const express = require('express');
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

const router = express.Router();

// Correct Routes
router.get('/', getCustomers);          // GET /api/customers
router.post('/', createCustomer);       // POST /api/customers
router.put('/:id', updateCustomer);     // PUT /api/customers/:id
router.delete('/:id', deleteCustomer);  // DELETE /api/customers/:id

module.exports = router;
