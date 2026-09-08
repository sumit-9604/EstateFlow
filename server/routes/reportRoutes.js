const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { getDashboardStats } = require('../controllers/reportController');

// Only Admins and Managers can view analytics 
router.get('/dashboard', [auth, checkRole(['Admin', 'Manager'])], getDashboardStats);

module.exports = router;