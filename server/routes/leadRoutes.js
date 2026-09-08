const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead
} = require('../controllers/leadController');

// GET /api/leads
router.get('/', auth, getLeads);

// POST /api/leads
router.post('/', auth, createLead);

// PUT /api/leads/:id
router.put('/:id', auth, updateLead);

// PUT /api/leads/:id/status
router.put('/:id/status', auth, updateLeadStatus);

// DELETE /api/leads/:id
router.delete('/:id', auth, deleteLead);

module.exports = router;