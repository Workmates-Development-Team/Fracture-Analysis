import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    organizationName: { type: String, required: true },
    name: { type: String, required: true },
    regId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    degree: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['radiologist', 'admin', 'doctor'], required: true }
});

// Password hashing
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
