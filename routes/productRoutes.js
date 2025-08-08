const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProductsByCategory, 
    getMyProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// PROTECTED ROUTES
router.post('/', authMiddleware, upload.single('imageUrl'), createProduct);
router.get('/me', authMiddleware, getMyProducts);
router.put('/:category/:id', authMiddleware, updateProduct);
router.delete('/:category/:id', authMiddleware, deleteProduct);

// PUBLIC ROUTES
router.get('/laptops', getProductsByCategory('Laptop'));
router.get('/bikes', getProductsByCategory('Bike'));
router.get('/cameras', getProductsByCategory('Camera'));
router.get('/gatebooks', getProductsByCategory('Gatebook'));
router.get('/drafters', getProductsByCategory('Drafter'));

module.exports = router;