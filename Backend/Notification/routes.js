import express from 'express';
import { createNotification, getNotificationById, getNotifications, getNotificationsByDviewStatus, updateDviewStatus } from './controller.js';

const router = express.Router();

router.post('/create-notification', createNotification);
router.get('/notifications-all/:id', getNotificationsByDviewStatus);
router.get('/notification-single/:id', getNotificationById);
router.post('/notification-update/:id', updateDviewStatus);




export default router;