import Admin from './model.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '12h',
    });
};

// Registration
export const registerAdmin = async (req, res) => {
    try {
        const newAdmin = await Admin.create(req.body);
        const token = generateToken(newAdmin._id, newAdmin.role);
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(admin._id, admin.role);
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update
export const updateAdmin = async (req, res) => {
    try {
        // Extract only the allowed fields from the request body
        const { name, degree, regId, email } = req.body;

        // Construct the update object with the allowed fields
        const updateFields = {
            ...(name && { name }),
            ...(degree && { degree }),
            ...(regId && { regId }),
            ...(email && { email }),
        };

        // Perform the update operation
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            updateFields,
            {
                new: true, // Return the updated document
                runValidators: true, // Run validators on the update
            }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.status(200).json({ success: true, data: updatedAdmin });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete
export const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        // Query to find admins with role 'radiologist' or 'doctor'
        const users = await Admin.find({
            role: { $in: ['radiologist', 'doctor'] }
        });

        // Check if users are found
        if (!users.length) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        // Return the found users
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the admin by ID (assuming req.user.id is set by the authenticateToken middleware)
        const admin = await Admin.findById(req.user.id);
        
        // Check if the admin exists
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Check if the current password is correct
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update the password
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};