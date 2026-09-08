const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getClients,
  getClientById,
  addClient,
  logInteraction,
  deleteClient
} = require('../controllers/clientController');

// GET /api/clients
router.get('/', auth, getClients);

// GET /api/clients/:id
router.get('/:id', auth, getClientById);

// POST /api/clients
router.post('/', auth, addClient);

// POST /api/clients/:id/interactions
router.post('/:id/interactions', auth, logInteraction);

// DELETE /api/clients/:id
router.delete('/:id', auth, deleteClient);

module.exports = router;
