import express from 'express';
import userProfileMiddleware from '../middleware/userProfile.js';
import userValidator from '../controller/profileValidator.js';

const router = express.Router();

router.get('/profile', userProfileMiddleware, userValidator);

export default router;