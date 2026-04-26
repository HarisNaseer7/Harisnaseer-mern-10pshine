const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logoutUser);

module.exports = router;
