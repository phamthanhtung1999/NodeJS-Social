// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { formatApiResponse } = require('../helpers/formatApiResponse');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header "Authorization: Bearer <token>"
    
    if (!token) {
        return res.status(403).json(formatApiResponse({ message: 'Token not provided!' }, 0));
    }
    
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Save user info to request (usable in controller)
        next(); // Proceed to the next step (controller)
    } catch (err) {
        return res.status(401).json(formatApiResponse({ message: 'Invalid or expired token!' }, 0));
    }
};

module.exports = authMiddleware;
