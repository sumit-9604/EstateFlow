const mongoose = require('mongoose');
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true }, // [cite: 7]
    phone: { type: String }, // [cite: 7]
    email: { type: String }, // [cite: 7]
    budget: { type: Number }, // [cite: 7]
    preferences: { type: String }, // [cite: 7]
    status: { 
        type: String, 
        enum: ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'], 
        default: 'New' 
    }, // [cite: 8]
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // [cite: 9]
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Lead', LeadSchema);