const express = require('express');
const router = express.Router();
const { updateUserProfile, addAddress, updateAddress, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUserProfile);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;
