const Deal = require('../models/Deal');
const Lead = require('../models/Lead');
const Property = require('../models/Property');

exports.getDashboardStats = async (req, res) => {
    try {
        const [closedDeals, allDeals, leadConversion, propertyStats] = await Promise.all([
            Deal.aggregate([
                { $match: { stage: 'Closed' } },
                { $group: { _id: null, total: { $sum: "$finalPrice" }, commission: { $sum: "$commissionAmount" }, count: { $sum: 1 } } }
            ]),
            Deal.aggregate([
                { $group: { _id: "$stage", total: { $sum: "$finalPrice" }, count: { $sum: 1 } } }
            ]),
            Lead.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Property.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ]);

        const totalRevenue = closedDeals[0]?.total || 0;
        const closedCommission = closedDeals[0]?.commission || 0;
        const closedDealsCount = closedDeals[0]?.count || 0;

        res.json({
            revenue: totalRevenue,
            commission: closedCommission,
            closedDealsCount,
            stageBreakdown: allDeals,
            leads: leadConversion,
            properties: propertyStats,
            timestamp: new Date()
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error generating analytics' });
    }
};