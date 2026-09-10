const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
    try {
        const newLead = new Lead({ ...req.body, assignedTo: req.user.id });
        const lead = await newLead.save();
        res.status(200).json(lead);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error creating lead', error: err.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const isAdminOrManager = req.user && (req.user.role === 'Admin' || req.user.role === 'Manager');
        let leads;
        if (isAdminOrManager) {
            leads = await Lead.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
        } else {
            leads = await Lead.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email').sort({ createdAt: -1 });
            if (!leads || leads.length === 0) {
                leads = await Lead.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
            }
        }
        res.json(leads);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching leads', error: err.message });
    }
};

exports.updateLeadStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead.findByIdAndUpdate(
            req.params.id, 
            { $set: { status } }, 
            { new: true }
        );
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error updating status', error: err.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error updating lead', error: err.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLead = await Lead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ msg: "Lead not found" });
        }

        res.status(200).json({ msg: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting lead", error: error.message });
    }
};