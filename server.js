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

// Start the Server and Sync Database
const PORT = process.env.PORT || 3001;
db.sequelize.sync()
  .then(async () => {
    console.log('Database synced successfully.');
    
    // Automatic Seeding Logic
    if (await db.User.count() === 0) {
      console.log('Seeding sample users...');
      await db.User.bulkCreate([
        { firstName: 'Abbas', lastName: 'Kasturi', email: 'abbas@example.com', password: 'password123' },
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123' }
      ]);
    }

    if (await db.Laptop.count() === 0) {
      console.log('Seeding sample laptops...');
      await db.Laptop.bulkCreate([
        { name: 'Dell XPS 15', rentalCostPerDay: 500, imageUrl: 'path/to/image.jpg', collectionPlace: 'Main Gate', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 3000, model: 'XPS 9520', userId: 1 },
        { name: 'MacBook Air M2', rentalCostPerDay: 800, imageUrl: 'path/to/image.jpg', collectionPlace: 'Library', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 5000, model: 'M2 Air', userId: 2 }
      ]);
    }
    // ...you can add more seeding blocks here for other tables...

    console.log('Seeding check complete.');

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("Failed to sync db: " + err.message);
  });