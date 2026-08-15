import express from 'express';
import {
  signup,
  login,
  resendVerification,
  verifyEmail,
} from '../controller/authController.js';
import {
  signupValidation,
  loginValidation,
} from '../middleware/authValidation.js';
import uploadIdCard from '../middleware/uploadIdCard.js';

const router = express.Router();

router.post('/login', loginValidation, login);

router.post('/resend-verification', resendVerification);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);

// Supports both standard JSON payloads and multipart/form-data
router.post(
  '/signup',
  (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      uploadIdCard(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            message: err.message || 'File upload failed',
            success: false,
          });
        }
        next();
      });
    } else {
      next();
    }
  },
  signupValidation,
  signup
);

export default router;
