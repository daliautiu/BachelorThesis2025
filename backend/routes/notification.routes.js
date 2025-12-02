// routes/notification.routes.js
const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get notifications for the logged-in user
router.get('/', verifyToken, notificationController.getUserNotifications);

// Mark a notification as read
router.put('/:id/read', verifyToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', verifyToken, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', verifyToken, notificationController.deleteNotification);

// Create a notification - Admin only
router.post('/', [verifyToken, isAdmin], notificationController.createNotification);

module.exports = router;