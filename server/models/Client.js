const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ['Buyer', 'Seller'], required: true }, 
    preferences: {
        budget: Number,
        location: String,
        propertyType: String
    },
    interactionHistory: [{
        date: { type: Date, default: Date.now },
        note: String,
        interactionType: { type: String, enum: ['Call', 'Email', 'Visit', 'Inquiry'] }
    }], 
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema);