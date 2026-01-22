const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const donationController = require('./donationController');
const authMiddleware = require('../../middleware/authMiddleware');

// @route   POST api/donations
// @desc    Create a donation offer
// @access  Private
router.post(
    '/',
    [
        authMiddleware,
        check('type', 'Type is required').isIn(['MONEY', 'GOODS', 'SERVICE']),
        check('description', 'Description is required').not().isEmpty(),
    ],
    donationController.createDonation
);

// @route   GET api/donations
// @desc    List donations (Admin or dashboard)
// @access  Private (could be public for transparency)
router.get('/', authMiddleware, donationController.getDonations);

module.exports = router;
