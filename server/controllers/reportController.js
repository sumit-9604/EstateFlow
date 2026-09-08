const Deal = require('../models/Deal');
const Lead = require('../models/Lead');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalRevenue = await Deal.aggregate([
            { $match: { status: 'Closed' } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const leadConversion = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            revenue: totalRevenue[0]?.total || 0,
            leads: leadConversion,
            timestamp: new Date()
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};