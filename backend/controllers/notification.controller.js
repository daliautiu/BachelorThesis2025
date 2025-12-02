// controllers/notification.controller.js
const { Notification } = require('../models');

// Get notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await notification.update({ read: true });
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.userId, read: false } }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await notification.destroy();
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a notification - Admin only
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, gameId } = req.body;
    
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      gameId
    });
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};