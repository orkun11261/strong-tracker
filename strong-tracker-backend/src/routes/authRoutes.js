const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);


router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;