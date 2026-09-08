const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    amenities: [String],
    status: { 
        type: String, 
        enum: ['Available', 'Sold', 'Rented', 'Under Offer'], 
        default: 'Available' 
    },
    images: [String], // Array to store multiple image paths 
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);