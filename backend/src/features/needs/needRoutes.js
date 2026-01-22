const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const needController = require('./needController');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

// @route   POST api/needs
// @desc    Create a need
// @access  Private
const optionalAuthMiddleware = require('../../middleware/optionalAuthMiddleware');

// @route   POST api/needs
// @desc    Create a need
// @access  Public (Optional Auth for user association)
router.post(
    '/',
    [
        optionalAuthMiddleware, // Added to associate user if logged in
        upload.single('image'),
        check('title', 'Title is required').not().isEmpty(),
        check('category', 'Category is required').not().isEmpty(),
        check('region', 'Region is required').not().isEmpty(),
    ],
    needController.createNeed
);

// @route   GET api/needs
// @desc    Get all needs
// @access  Public (Optional Auth for visibility)
router.get('/', optionalAuthMiddleware, needController.getNeeds);

// @route   GET api/needs/:id
// @desc    Get need by ID
// @access  Public (Optional Auth for visibility)
router.get('/:id', optionalAuthMiddleware, needController.getNeedById);

// @route   PUT api/needs/:id
// @desc    Update need status
// @access  Private
router.put('/:id', authMiddleware, needController.updateNeedStatus);

// @route   DELETE api/needs/:id
// @desc    Delete need
// @access  Private (Admin or Owner)
router.delete('/:id', authMiddleware, needController.deleteNeed);

module.exports = router;
