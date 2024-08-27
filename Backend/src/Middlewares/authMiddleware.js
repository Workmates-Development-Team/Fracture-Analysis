import jwt from 'jsonwebtoken';

// Middleware to authenticate and verify JWT token
export const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};
