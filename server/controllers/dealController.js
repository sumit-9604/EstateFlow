const Deal = require('../models/Deal');

// Get All Deals for Agent / Organization
exports.getDeals = async (req, res) => {
    try {
        const isAdminOrManager = req.user && (req.user.role === 'Admin' || req.user.role === 'Manager');
        const populateQuery = (query) => query
            .populate('client', 'name email phone type')
            .populate('property', 'title location price images status')
            .populate('agent', 'name email')
            .sort({ createdAt: -1 });

        let deals;
        if (isAdminOrManager) {
            deals = await populateQuery(Deal.find());
        } else {
            deals = await populateQuery(Deal.find({ agent: req.user.id }));
            if (!deals || deals.length === 0) {
                deals = await populateQuery(Deal.find());
            }
        }
        res.json(deals);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching deals' });
    }
};

// Create New Deal
exports.createDeal = async (req, res) => {
    try {
        const { client, property, finalPrice, commissionRate, stage } = req.body;
        const newDeal = new Deal({
            client,
            property,
            agent: req.user.id,
            finalPrice: Number(finalPrice),
            commissionRate: commissionRate ? Number(commissionRate) : 3,
            stage: stage || 'Negotiation'
        }); 
        await newDeal.save();
        const populatedDeal = await Deal.findById(newDeal._id)
            .populate('client', 'name email phone type')
            .populate('property', 'title location price images status')
            .populate('agent', 'name email');
        res.status(201).json(populatedDeal);
    } catch (error) {
        res.status(400).json({ msg: "Error creating deal", error: error.message });
    }
};

// Update Deal Stage (For Kanban dragging) 
exports.updateDealStage = async (req, res) => {
    try {
        const { stage } = req.body;
        const deal = await Deal.findByIdAndUpdate(
            req.params.id, 
            { stage }, 
            { new: true }
        )
            .populate('client', 'name email phone type')
            .populate('property', 'title location price images status')
            .populate('agent', 'name email');
        
        if (!deal) return res.status(404).json({ msg: 'Deal not found' });
        res.json(deal);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error updating deal stage' });
    }
};

// Delete Deal
exports.deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) return res.status(404).json({ msg: 'Deal not found' });
        res.json({ msg: 'Deal removed successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error deleting deal' });
    }
};

// Get Deal Reports (Commission tracking)
exports.getDealReports = async (req, res) => {
    try {
        const deals = await Deal.find().populate('client property agent');
        res.json(deals);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching reports' });
    }
};