const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProductsByCategory, 
    getMyProducts,
    updateProduct,
    deleteProduct,
    getAllProducts // 1. Import the new function
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// === PROTECTED ROUTES (Require user to be logged in) ===
router.post('/', authMiddleware, upload.single('imageUrl'), createProduct);
router.get('/me', authMiddleware, getMyProducts);
router.put('/:category/:id', authMiddleware, updateProduct);
router.delete('/:category/:id', authMiddleware, deleteProduct);

// === PUBLIC ROUTES (Can be accessed by anyone) ===

// 2. Add the new route to get ALL products
router.get('/', getAllProducts);

// Existing routes to get products by a specific category
router.get('/laptops', getProductsByCategory('Laptop'));
router.get('/bikes', getProductsByCategory('Bike'));
router.get('/cameras', getProductsByCategory('Camera'));
router.get('/gatebooks', getProductsByCategory('Gatebook'));
router.get('/drafters', getProductsByCategory('Drafter'));

module.exports = router;