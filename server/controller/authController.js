import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../models/user.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, studentId, college, university, studentDeclared } = req.body;

    const campusName = (college || university || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanStudentId = (studentId || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanEmail || !password || !cleanStudentId || !campusName) {
      return res.status(400).json({
        message: 'All fields (Full Name, Email, Password, College, Student ID) are required',
        success: false,
      });
    }

    const existingEmail = await UserModel.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({
        message: 'An account with this email already exists. Please log in.',
        success: false,
      });
    }

    const existingStudent = await UserModel.findOne({ studentId: cleanStudentId });
    if (existingStudent) {
      return res.status(409).json({
        message: 'This Student ID is already registered.',
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const idCardPath = req.file ? `/uploads/id-cards/${req.file.filename}` : '';

    // Generate random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create User & Profile
    const newUser = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      studentId: cleanStudentId,
      university: campusName,
      college: campusName,
      role: 'student',
      idCardPath,
      studentDeclared: studentDeclared !== undefined ? Boolean(studentDeclared) : true,
      isEmailVerified: false,
      verificationToken,
      verificationExpires,
      verificationStatus: 'pending',
    });

    res.status(201).json({
      message: 'Account created! We sent a verification link to your registered email.',
      success: true,
      verificationToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId,
        college: newUser.college || newUser.university,
        isEmailVerified: false,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(409).json({
        message: `This ${field} is already registered`,
        success: false,
      });
    }
    res.status(500).json({
      message: 'Internal Server Error during registration',
      success: false,
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({
        message: 'Email is required to resend verification',
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email address',
        success: false,
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        message: 'This email is already verified. You can log in directly.',
        success: true,
        alreadyVerified: true,
      });
    }

    // Generate fresh verification token
    const newToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = newToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    res.status(200).json({
      message: 'Verification link resent to your email.',
      success: true,
      verificationToken: newToken,
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({
      message: 'Failed to resend verification email',
      success: false,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    const email = req.query.email || req.body.email;

    if (!token && !email) {
      return res.status(400).json({
        message: 'Verification token or email is required',
        success: false,
      });
    }

    let user;
    if (token) {
      user = await UserModel.findOne({ verificationToken: token });
    } else if (email) {
      user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification link',
        success: false,
      });
    }

    user.isEmailVerified = true;
    user.verificationStatus = 'verified';
    user.verificationToken = '';
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      success: true,
      email: user.email,
    });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({
      message: 'Failed to verify email',
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: cleanEmail });
    const errorMsg = 'Invalid email or password';

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    if (user.role && user.role !== 'student' && user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only verified students can access this campus exchange',
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        studentId: user.studentId,
        role: user.role,
      },
      process.env.JWT_SECRET || 'studx-dev-jwt-secret',
      { expiresIn: '48h' }
    );

    res.status(200).json({
      message: 'Login successful! Welcome back.',
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
      studentId: user.studentId,
      college: user.college || user.university,
      university: user.university || user.college,
      isEmailVerified: user.isEmailVerified,
      verificationStatus: user.verificationStatus,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      message: 'Internal Server Error during login',
      success: false,
    });
  }
};

export default {
  signup,
  resendVerification,
  verifyEmail,
  login,
};
