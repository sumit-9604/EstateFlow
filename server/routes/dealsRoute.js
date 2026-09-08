const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    getDeals, 
    createDeal, 
    updateDealStage, 
    deleteDeal 
} = require('../controllers/dealController');

// GET /api/deals
router.get('/', auth, getDeals);

// POST /api/deals
router.post('/', auth, createDeal);

// PUT /api/deals/:id/stage
router.put('/:id/stage', auth, updateDealStage);

// DELETE /api/deals/:id
router.delete('/:id', auth, deleteDeal);

module.exports = router;
