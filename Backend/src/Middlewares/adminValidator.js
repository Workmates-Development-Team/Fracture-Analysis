import { z } from 'zod';

// Define the Zod schema for validating admin data
const adminSchema = z.object({
    organizationName: z.string().min(1, "Organization name is required"),
    name: z.string().min(1, "Name is required"),
    regId: z.string().min(1, "Registration ID is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['radiologist', 'admin', 'doctor'], "Invalid role"),
});

// Define the Zod schema for validating login data
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Middleware function to validate admin data
export const validateAdmin = (req, res, next) => {
    try {
        // Parse and validate the request body against the schema
        adminSchema.parse(req.body);
        next(); // Proceed to the next middleware or route handler if validation passes
    } catch (error) {
        // Return a 400 status with the validation errors if validation fails
        return res.status(400).json({ success: false, error: error.errors });
    }
};

// Middleware function to validate login data
export const validateLogin = (req, res, next) => {
    try {
        // Parse and validate the request body against the schema
        loginSchema.parse(req.body);
        next(); // Proceed to the next middleware or route handler if validation passes
    } catch (error) {
        // Return a 400 status with the validation errors if validation fails
        return res.status(400).json({ success: false, error: error.errors });
    }
};
