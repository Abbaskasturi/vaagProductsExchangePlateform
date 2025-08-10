const { Op } = require('sequelize');
const db = require('../models');

// Helper function to get the correct product model based on the category string
const getModelByCategory = (category) => {
    if (!category) return null;
    const models = {
        bike: db.Bike,
        laptop: db.Laptop,
        camera: db.Camera,
        gatebook: db.Gatebook,
        drafter: db.Drafter,
        calculator: db.Calculator
    };
    return models[category.toLowerCase()];
};

// @desc    A user creates a new rental request
exports.createRentalRequest = async (req, res) => {
    const renterId = req.user.id;
    const { productId, productCategory, startDate, endDate } = req.body;
    try {
        const ProductModel = getModelByCategory(productCategory);
        if (!ProductModel) return res.status(400).json({ message: "Invalid product category." });
        
        const product = await ProductModel.findByPk(productId);
        if (!product) return res.status(404).json({ message: "Product not found." });
        if (product.userId === renterId) return res.status(400).json({ message: "You cannot rent your own item." });

        const rental = await db.Rental.create({
            renterId, productId, productCategory, startDate, endDate, status: 'pending'
        });

        await db.Notification.create({
            userId: product.userId, // Notify the product owner
            message: `${req.user.name} has requested to rent your item: ${product.name}.`,
            link: `/rentals/listings/${rental.id}`
        });

        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rental request', error: error.message });
    }
};

// @desc    An owner updates a rental status (approve/reject/complete)
exports.updateRentalStatus = async (req, res) => {
    const loggedInUserId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    try {
        const rental = await db.Rental.findByPk(id);
        if (!rental) return res.status(404).json({ message: 'Rental request not found.' });

        const ProductModel = getModelByCategory(rental.productCategory);
        const product = await ProductModel.findByPk(rental.productId);
        
        if (product.userId !== loggedInUserId) {
            return res.status(403).json({ message: 'You are not the owner of this item.' });
        }

        rental.status = status;
        await rental.save();

        let message = `Your rental request for '${product.name}' has been updated to ${status}.`;
        await db.Notification.create({
            userId: rental.renterId, // Notify the renter
            message: message,
            link: `/rentals/my-rentals/${rental.id}`
        });

        res.status(200).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rental status', error: error.message });
    }
};

// @desc    A user gets their list of rentals
exports.getMyRentals = async (req, res) => {
    try {
        const rentals = await db.Rental.findAll({ where: { renterId: req.user.id } });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your rentals', error: error.message });
    }
};

// @desc    An owner gets rental requests for their items (with filtering)
exports.getMyListings = async (req, res) => {
    const ownerId = req.user.id;
    const { status } = req.query; // Get 'active', 'pending', etc. from the URL

    try {
        // 1. Get all IDs of products owned by the user across all tables
        const myLaptopIds = (await db.Laptop.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        const myBikeIds = (await db.Bike.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        const myCameraIds = (await db.Camera.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        const myGatebookIds = (await db.Gatebook.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        const myDrafterIds = (await db.Drafter.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        const myCalculatorIds = (await db.Calculator.findAll({ where: { userId: ownerId }, attributes: ['id'] })).map(p => p.id);
        
        // 2. Build the database query's "where" clause
        const whereClause = {
            // Find rentals where the product ID and category match our list of owned products
            [Op.or]: [
                { productCategory: 'Laptop', productId: { [Op.in]: myLaptopIds } },
                { productCategory: 'Bike', productId: { [Op.in]: myBikeIds } },
                { productCategory: 'Camera', productId: { [Op.in]: myCameraIds } },
                { productCategory: 'Gatebook', productId: { [Op.in]: myGatebookIds } },
                { productCategory: 'Drafter', productId: { [Op.in]: myDrafterIds } },
                { productCategory: 'Calculator', productId: { [Op.in]: myCalculatorIds } }
            ]
        };

        // 3. If a status is provided in the URL, add it to the query
        if (status) {
            whereClause.status = status;
        }

        // 4. Find all rentals that match the complete query
        const myProductRentals = await db.Rental.findAll({ where: whereClause });

        res.status(200).json(myProductRentals);
    } catch (error) {
         res.status(500).json({ message: 'Error fetching your listings', error: error.message });
    }
};