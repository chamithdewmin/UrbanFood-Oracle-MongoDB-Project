const express = require('express');
const multer = require('multer');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.use(express.json());

router.get('/', getProducts);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
