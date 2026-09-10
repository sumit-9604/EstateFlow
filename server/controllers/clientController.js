const Client = require('../models/Client');

// Create New Client Profile
exports.addClient = async (req, res) => {
    try {
        const newClient = new Client({ ...req.body, assignedAgent: req.user.id });
        const client = await newClient.save();
        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error creating client profile', error: err.message });
    }
};

// Get All Clients for the Agent / Organization
exports.getClients = async (req, res) => {
    try {
        const isAdminOrManager = req.user && (req.user.role === 'Admin' || req.user.role === 'Manager');
        let clients;
        if (isAdminOrManager) {
            clients = await Client.find().sort({ createdAt: -1 });
        } else {
            clients = await Client.find({ assignedAgent: req.user.id }).sort({ createdAt: -1 });
            if (!clients || clients.length === 0) {
                clients = await Client.find().sort({ createdAt: -1 });
            }
        }
        res.json(clients);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching clients', error: err.message });
    }
};

// Get Single Client Profile
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching client profile', error: err.message });
    }
};

// Log an Interaction for a Client
exports.logInteraction = async (req, res) => {
    try {
        const { note, interactionType } = req.body;
        const client = await Client.findById(req.params.id);
        
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client.interactionHistory.unshift({ 
            note, 
            interactionType: interactionType || 'Note',
            date: new Date()
        });
        await client.save();
        res.json(client);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error logging interaction', error: err.message });
    }
};

// Delete Client
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });
        res.json({ msg: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error deleting client', error: err.message });
    }
};