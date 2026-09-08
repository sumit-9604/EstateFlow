const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
    title: String,
    location: String, [cite: 20]
    price: Number, [cite: 20]
    images: [String], [cite: 25]
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' }, [cite: 21]
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Property', PropertySchema);