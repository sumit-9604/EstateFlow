const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    finalPrice: { type: Number, required: true },
    commissionRate: { type: Number, default: 3 }, 
    commissionAmount: { type: Number }, 
    stage: { 
        type: String, 
        enum: ['Negotiation', 'Agreement', 'Closed'], 
        default: 'Negotiation' 
    },
    documents: [{
        name: String,
        url: String
    }],
    createdAt: { type: Date, default: Date.now }
});

DealSchema.pre('save', function(next) {
    this.commissionAmount = (this.finalPrice * this.commissionRate) / 100;
    next();
});

module.exports = mongoose.model('Deal', DealSchema);