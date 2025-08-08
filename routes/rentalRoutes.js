const express = require('express');
const router = express.Router();
const { createRentalRequest, updateRentalStatus, getMyRentals, getMyListings } = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createRentalRequest);
router.patch('/:id/status', authMiddleware, updateRentalStatus);
router.get('/my-rentals', authMiddleware, getMyRentals);
router.get('/my-listings', authMiddleware, getMyListings);

module.exports = router;