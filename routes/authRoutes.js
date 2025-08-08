const express = require('express');
const router = express.Router();

// Import the controller functions we just created
const { registerUser, loginUser } = require('../controllers/authController');

// This line means: When a POST request is made to the URL '/api/auth/register',
// run the 'registerUser' function from the controller.
router.post('/register', registerUser);

// This line means: When a POST request is made to the URL '/api/auth/login',
// run the 'loginUser' function from the controller.
router.post('/login', loginUser);

module.exports = router;