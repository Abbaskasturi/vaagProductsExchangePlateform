require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Import All Route Files
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
  .then(async () => { // Use 'async' to allow for 'await'
    console.log('Database synced successfully.');
    
    // --- AUTOMATIC SEEDING LOGIC ---
    
    // 1. Seed Users (must be done first)
    if (await db.User.count() === 0) {
      console.log('No users found. Seeding sample users...');
      await db.User.bulkCreate([
        { firstName: 'Abbas', lastName: 'Kasturi', email: 'abbas@example.com', password: 'hashed_password' },
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'hashed_password' }
      ]);
    }

    // 2. Seed Laptops
    if (await db.Laptop.count() === 0) {
      console.log('No laptops found. Seeding sample laptops...');
      await db.Laptop.bulkCreate([
        { name: 'Dell XPS 15', rentalCostPerDay: 500, imageUrl: 'path/to/image.jpg', collectionPlace: 'Main Gate', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 3000, model: 'XPS 9520', ram: '16GB', rom: '512GB SSD', processor: 'Intel i7', userId: 1 },
        { name: 'MacBook Air M2', rentalCostPerDay: 800, imageUrl: 'path/to/image.jpg', collectionPlace: 'Library', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 5000, model: 'M2 Air', ram: '8GB', rom: '256GB SSD', processor: 'Apple M2', userId: 2 }
      ]);
    }
    
    // 3. Seed Bikes
    if (await db.Bike.count() === 0) {
      console.log('No bikes found. Seeding sample bikes...');
      await db.Bike.bulkCreate([
          { name: 'Mountain Bike', rentalCostPerDay: 150, imageUrl: 'path/to/image.jpg', collectionPlace: 'Main Gate', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 1000, model: 'Gear Pro', userId: 1 },
          { name: 'Electric Scooter', rentalCostPerDay: 200, imageUrl: 'path/to/image.jpg', collectionPlace: 'Hostel Block', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 1500, model: 'e-Go', userId: 2 }
      ]);
    }
    
    // 4. Seed Cameras (you can continue this pattern for all tables)
    if (await db.Camera.count() === 0) {
        console.log('No cameras found. Seeding sample cameras...');
        await db.Camera.bulkCreate([
            { name: 'Canon EOS 200D', rentalCostPerDay: 600, imageUrl: 'path/to/image.jpg', collectionPlace: 'Main Gate', contactPhoneNumber: '1234567890', proofRequired: 'ID Card', securityDeposit: 3500, model: 'EOS 200D', userId: 1 }
        ]);
    }

    console.log('Seeding check complete.');
    // --- END OF SEEDING LOGIC ---

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("Failed to sync db: " + err.message);
  });