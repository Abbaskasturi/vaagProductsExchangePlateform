const db = require('../models');

const getModelByCategory = (category) => {
    if (!category) return null;
    const models = {
        bike: db.Bike,
        laptop: db.Laptop,
        camera: db.Camera,
        gatebook: db.Gatebook,
        drafter: db.Drafter,
        calculator: db.Calculator // <-- UPDATED
    };
    return models[category.toLowerCase()];
};

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

exports.getMyProducts = async (req, res) => {
    const userId = req.user.id;
    try {
        const myBikes = await db.Bike.findAll({ where: { userId } });
        const myLaptops = await db.Laptop.findAll({ where: { userId } });
        const myCameras = await db.Camera.findAll({ where: { userId } });
        const myGatebooks = await db.Gatebook.findAll({ where: { userId } });
        const myDrafters = await db.Drafter.findAll({ where: { userId } });
        const myCalculators = await db.Calculator.findAll({ where: { userId } }); // <-- UPDATED
        const allMyProducts = [ ...myBikes, ...myLaptops, ...myCameras, ...myGatebooks, ...myDrafters, ...myCalculators ]; // <-- UPDATED
        res.status(200).json(allMyProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user products', error: error.message });
    }
};

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