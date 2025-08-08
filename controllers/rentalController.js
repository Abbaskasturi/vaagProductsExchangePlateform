const db = require('../models');

// Helper to get product model by category
const getModelByCategory = (category) => {
    if (!category) return null;
    const models = {
        bike: db.Bike, laptop: db.Laptop, camera: db.Camera,
        gatebook: db.Gatebook, drafter: db.Drafter
    };
    return models[category.toLowerCase()];
};

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

exports.getMyRentals = async (req, res) => {
    try {
        const rentals = await db.Rental.findAll({ where: { renterId: req.user.id } });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your rentals', error: error.message });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        const allRentals = await db.Rental.findAll();
        const myLaptops = await db.Laptop.findAll({ where: { userId: req.user.id }, attributes: ['id'] });
        const myBikes = await db.Bike.findAll({ where: { userId: req.user.id }, attributes: ['id'] });
        // ... add other product types here
        const myProductIds = {
            Laptop: myLaptops.map(p => p.id),
            Bike: myBikes.map(p => p.id)
        };
        
        const myProductRentals = allRentals.filter(rental => 
            myProductIds[rental.productCategory] && myProductIds[rental.productCategory].includes(rental.productId)
        );
        res.status(200).json(myProductRentals);
    } catch (error) {
         res.status(500).json({ message: 'Error fetching your listings', error: error.message });
    }
};