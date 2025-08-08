const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getNotifications);
router.patch('/mark-as-read', authMiddleware, markNotificationsAsRead);

module.exports = router;