const express = require('express');
const router = express.Router();
const messageController = require('./messageController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/', authMiddleware, messageController.sendMessage);
router.get('/need/:needId', authMiddleware, messageController.getMessagesByNeed);

module.exports = router;
