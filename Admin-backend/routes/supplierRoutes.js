const express = require('express');
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');

const router = express.Router();

// Routes
router.post('/', createSupplier);      // Add supplier
router.get('/', getSuppliers);          // Get all suppliers
router.put('/:id', updateSupplier);     // Update supplier
router.delete('/:id', deleteSupplier);  // Delete supplier

module.exports = router;
