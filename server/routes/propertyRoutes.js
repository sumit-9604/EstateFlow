const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');
const { 
    addProperty, 
    getProperties, 
    deleteProperty, 
    updateProperty 
} = require('../controllers/propertyController');

// @route   POST api/properties -> Create 
router.post('/', [auth, upload.array('images', 5)], addProperty); 

// @route   GET api/properties -> Read (Includes filtering) 
router.get('/', getProperties); 

// @route   PUT api/properties/:id -> Update 
router.put('/:id', auth, updateProperty);

// @route   DELETE api/properties/:id -> Delete 
router.delete('/:id', auth, deleteProperty);

module.exports = router;