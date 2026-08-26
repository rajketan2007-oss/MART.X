const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
