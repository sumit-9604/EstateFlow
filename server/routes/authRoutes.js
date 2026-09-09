const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { 
    register, 
    login, 
    getMe, 
    getAllUsers, 
    createTeamMember, 
    updateUserRole, 
    deleteTeamMember 
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// Team & Role Management routes
router.get('/users', auth, getAllUsers);
router.post('/users', [auth, checkRole(['Admin'])], createTeamMember);
router.put('/users/:id/role', [auth, checkRole(['Admin'])], updateUserRole);
router.delete('/users/:id', [auth, checkRole(['Admin'])], deleteTeamMember);

module.exports = router;