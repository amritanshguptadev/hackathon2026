import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const profileMiddleware = async (req, res, next) => {
    try {
        let token = req.header('authorization') || req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isSuspended) {
            return res.status(403).json({ success: false, message: 'Account is suspended' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default profileMiddleware;
