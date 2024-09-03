import Notification from './model.js';

export const createNotification = async (req, res) => {
    try {
        const { notification, rviewStatus, dviewStatus } = req.body;

        const newNotification = await Notification.create({
            notification,
            rviewStatus,
            dviewStatus
        });

        res.status(201).json({
            success: true,
            data: newNotification,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getNotificationsByDviewStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const notifications = await Notification.find({
            dviewStatus: { $ne: userId }
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateDviewStatus = async (req, res) => {
    try {
        const { adminId } = req.body;
        const notificationId = req.params.id;

        // Find the notification and update dviewStatus
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { dviewStatus: adminId } }, // $addToSet to avoid duplicates
            { new: true }
        );
        
        // Check if notification exists
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Success response
        res.status(200).json(notification);
    } catch (error) {
        console.error('Server error:', error); // Log the error to the console
        res.status(500).json({ error: 'Server error' });
    }
};


