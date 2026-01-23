const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('./authController');
const authMiddleware = require('../../middleware/authMiddleware');
const User = require('./userModel');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    [
        check('fullName', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.login
);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

// @route   GET api/auth/profile/:id
// @desc    Get public user profile
// @access  Public (or Private, I'll keep it public for trust)
router.get('/profile/:id', authController.getUserProfile);

module.exports = router;
