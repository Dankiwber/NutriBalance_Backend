const jwt = require('jsonwebtoken');
const { has } = require('../services/cleanup_ser/Token_blacklist');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, please login' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const isBlacklisted = await has(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is invalid or blacklisted' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = authMiddleware;
