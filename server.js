require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Your route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Enart Exchange Platform API." });
});


// Get the port from environment variables, with a default for local development
const PORT = process.env.PORT || 3001;

// This just starts the server immediately.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});