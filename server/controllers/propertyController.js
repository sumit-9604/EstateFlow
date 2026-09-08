const Property = require('../models/Property');

// Add Property Listing [cite: 19]
exports.addProperty = async (req, res) => {
    try {
        const { title, location, price, size, amenities, status } = req.body;
        
        // Map the uploaded files to their paths 
        const imagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);

        const newProperty = new Property({
            title,
            location,
            price,
            size,
            amenities: typeof amenities === 'string' ? amenities.split(',') : amenities,
            status: status || 'Available', 
            images: imagePaths,
            agent: req.user.id 
        });

        const property = await newProperty.save();
        res.status(201).json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during property creation');
    }
};

// Get All Properties with Search/Filter 
exports.getProperties = async (req, res) => {
    try {
        // Basic filtering logic 
        const { location, minPrice, maxPrice } = req.query;
        let query = {};
        if (location) query.location = new RegExp(location, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(query).sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        res.status(500).send('Server Error fetching listings');
    }
};

// Delete Property 
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        await property.deleteOne();
        res.json({ msg: 'Listing removed successfully' });
    } catch (err) {
        res.status(500).send('Server Error deleting listing');
    }
};

exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during property update');
    }
};