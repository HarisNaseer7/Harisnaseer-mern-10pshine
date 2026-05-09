const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password });
    logger.info(`New user registered: ${user.email}`);
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { _id: user._id, name: user.name, email: user.email, token } });
  } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    logger.info(`User logged in: ${user.email}`);
    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Login successful', data: { _id: user._id, name: user.name, email: user.email, token } });
  } catch (error) { next(error); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (error) { next(error); }
};

const logoutUser = async (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
