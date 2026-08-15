const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, studentId, university, studentDeclared } =
      req.body;

    if (!req.file) {
      return res.status(400).json({
        message: 'Student ID card photo is required',
        success: false,
      });
    }

    const declared =
      studentDeclared === true ||
      studentDeclared === 'true' ||
      studentDeclared === 'on' ||
      studentDeclared === '1';

    if (!declared) {
      return res.status(400).json({
        message: 'You must confirm you are a university student',
        success: false,
      });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: 'User already exists, you can login',
        success: false,
      });
    }

    const existingStudent = await UserModel.findOne({ studentId });
    if (existingStudent) {
      return res.status(409).json({
        message: 'This student ID is already registered',
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const idCardPath = `/uploads/id-cards/${req.file.filename}`;

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      studentId: String(studentId).trim(),
      university: String(university).trim(),
      role: 'student',
      idCardPath,
      studentDeclared: true,
      verificationStatus: 'pending',
    });

    res.status(201).json({
      message:
        'Student signup successful. Your ID card was submitted for campus verification.',
      success: true,
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
      message: 'Internal Server Error',
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = 'Authentication failed. Email or password is wrong';

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    if (user.role && user.role !== 'student') {
      return res.status(403).json({
        message: 'Only university students can login to STUDx',
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
      process.env.JWT_SECRET,
      { expiresIn: '48hr' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: true,
      jwtToken,
      email,
      name: user.name,
      studentId: user.studentId,
      university: user.university,
      verificationStatus: user.verificationStatus,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
};
