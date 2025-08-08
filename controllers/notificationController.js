const db = require('../models');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await db.Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    try {
        await db.Notification.update(
            { isRead: true },
            { where: { userId: req.user.id, isRead: false } }
        );
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
};