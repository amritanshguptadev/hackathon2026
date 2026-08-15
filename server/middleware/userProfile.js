const jwt = require('jsonwebtoken');
const User = require('../models/user');

const profileMiddleware = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

module.exports = profileMiddleware;
