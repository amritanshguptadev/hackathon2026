const { signup, login } = require('../controller/authController');
const {
  signupValidation,
  loginValidation,
} = require('../middleware/authValidation');
const uploadIdCard = require('../middleware/uploadIdCard');

const router = require('express').Router();

router.post('/login', loginValidation, login);

router.post(
  '/signup',
  (req, res, next) => {
    uploadIdCard(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || 'ID card upload failed',
          success: false,
        });
      }
      next();
    });
  },
  signupValidation,
  signup
);

module.exports = router;
