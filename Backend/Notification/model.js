import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notification: { type: String, required: true },
   // rviewStatus: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }, // Array of ObjectIds
   dviewStatus: { type: [String], default: [] }, // Array of ObjectIds
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;