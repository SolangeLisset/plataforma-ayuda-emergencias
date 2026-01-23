const express = require('express');
const router = express.Router();
const announcementController = require('./announcementController');
const authMiddleware = require('../../middleware/authMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

// Public: Get all active announcements
router.get('/', announcementController.getAnnouncements);

// Protected: Admin only
router.post('/', [authMiddleware, adminMiddleware], announcementController.createAnnouncement);
router.put('/:id', [authMiddleware, adminMiddleware], announcementController.updateAnnouncement);
router.delete('/:id', [authMiddleware, adminMiddleware], announcementController.deleteAnnouncement);

module.exports = router;
