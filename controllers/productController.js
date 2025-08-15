const db = require('../models');

// Helper function to get the correct database model based on a category string
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

// --- CREATE A NEW PRODUCT ---
exports.createProduct = async (req, res) => {
    const userId = req.user.id;
    const { category, ...productData } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required.' });
    }
    const imageUrl = `/uploads/images/${req.file.filename}`;
    if (!category) {
        return res.status(400).json({ message: 'Product category is required.' });
    }
    const Model = getModelByCategory(category);
    if (!Model) {
        return res.status(400).json({ message: 'Invalid product category.' });
    }
    try {
        const dataToSave = { ...productData, userId, imageUrl };
        const newProduct = await Model.create(dataToSave);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// --- GET ALL PRODUCTS FROM EVERY CATEGORY ---
exports.getAllProducts = async (req, res) => {
    try {
        const includeOwner = {
            include: {
                model: db.User,
                as: 'owner',
                attributes: ['id', 'name']
            }
        };

        const bikes = await db.Bike.findAll(includeOwner);
        const laptops = await db.Laptop.findAll(includeOwner);
        const cameras = await db.Camera.findAll(includeOwner);
        const gatebooks = await db.Gatebook.findAll(includeOwner);
        const drafters = await db.Drafter.findAll(includeOwner);
        const calculators = await db.Calculator.findAll(includeOwner);

        // Map over each array to add the category property
        const allProducts = [
            ...bikes.map(p => ({ ...p.get({ plain: true }), category: 'Bike' })),
            ...laptops.map(p => ({ ...p.get({ plain: true }), category: 'Laptop' })),
            ...cameras.map(p => ({ ...p.get({ plain: true }), category: 'Camera' })),
            ...gatebooks.map(p => ({ ...p.get({ plain: true }), category: 'Gatebook' })),
            ...drafters.map(p => ({ ...p.get({ plain: true }), category: 'Drafter' })),
            ...calculators.map(p => ({ ...p.get({ plain: true }), category: 'Calculator' })),
        ];

        res.status(200).json(allProducts);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --- GET PRODUCTS FILTERED BY A SPECIFIC CATEGORY ---
exports.getProductsByCategory = (category) => {
    return async (req, res) => {
        const Model = getModelByCategory(category);
        try {
            const products = await Model.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Error fetching ${category}s`, error: error.message });
        }
    };
};

// --- GET ALL PRODUCTS POSTED BY THE LOGGED-IN USER ---
// THIS IS THE CORRECTED FUNCTION
exports.getMyProducts = async (req, res) => {
    const userId = req.user.id;
    try {
        // Using { raw: true } returns plain objects instead of Sequelize instances
        const myBikes = await db.Bike.findAll({ where: { userId }, raw: true });
        const myLaptops = await db.Laptop.findAll({ where: { userId }, raw: true });
        const myCameras = await db.Camera.findAll({ where: { userId }, raw: true });
        const myGatebooks = await db.Gatebook.findAll({ where: { userId }, raw: true });
        const myDrafters = await db.Drafter.findAll({ where: { userId }, raw: true });
        const myCalculators = await db.Calculator.findAll({ where: { userId }, raw: true });

        // Map over each array to add the category property to each product
        const allMyProducts = [
            ...myBikes.map(product => ({ ...product, category: 'Bike' })),
            ...myLaptops.map(product => ({ ...product, category: 'Laptop' })),
            ...myCameras.map(product => ({ ...product, category: 'Camera' })),
            ...myGatebooks.map(product => ({ ...product, category: 'Gatebook' })),
            ...myDrafters.map(product => ({ ...product, category: 'Drafter' })),
            ...myCalculators.map(product => ({ ...product, category: 'Calculator' })),
        ];

        res.status(200).json(allMyProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user products', error: error.message });
    }
};

// --- UPDATE A SPECIFIC PRODUCT ---
exports.updateProduct = async (req, res) => {
    const loggedInUserId = req.user.id;
    const { category, id } = req.params;
    const Model = getModelByCategory(category);
    if (!Model) {
        return res.status(400).json({ message: 'Invalid product category.' });
    }
    try {
        const product = await Model.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.userId !== loggedInUserId) {
            return res.status(403).json({ message: 'User not authorized to update this product.' });
        }
        const updatedProduct = await product.update(req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// --- DELETE A SPECIFIC PRODUCT ---
exports.deleteProduct = async (req, res) => {
    const loggedInUserId = req.user.id;
    const { category, id } = req.params;
    const Model = getModelByCategory(category);
    if (!Model) {
        return res.status(400).json({ message: 'Invalid product category.' });
    }
    try {
        const product = await Model.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.userId !== loggedInUserId) {
            return res.status(403).json({ message: 'User not authorized to delete this product.' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};