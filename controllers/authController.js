const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This function handles the logic for registering a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // First, check if a user with this email already exists
        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // If not, create the new user. The password will be hashed automatically by the hook in your user.js model.
        const user = await db.User.create({ name, email, password });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // This will catch errors, including the validation error if the email is not a @vaagdevi.edu.in address
        res.status(400).json({ message: error.message });
    }
};

// This function handles the logic for logging in an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by their email
        const user = await db.User.findOne({ where: { email } });

        // Check if the user was found AND if the provided password matches the stored hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // If login is successful, create a JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            
            // Send back a success message with the token and user info
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } else {
            // If user not found or password doesn't match, send an error
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};