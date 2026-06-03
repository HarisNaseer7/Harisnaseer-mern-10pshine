const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendResetEmail = async (email, resetURL) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"NoteApp" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your NoteApp password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
          <div style="width:36px;height:36px;background:#0f1117;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:16px;">N</div>
          <span style="font-size:17px;font-weight:600;color:#0f1117;">NoteApp</span>
        </div>
        <h2 style="color:#111827;font-size:22px;margin-bottom:8px;">Reset your password</h2>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;margin-bottom:24px;">
          We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetURL}" style="display:inline-block;background:#0f1117;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:500;">
          Reset Password
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    logger.info(`New user registered: ${user.email}`);
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { _id: user._id, name: user.name, email: user.email, token } });
  } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.authProvider === 'google' && !user.password)
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in. Please continue with Google.' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    logger.info(`User logged in: ${user.email}`);
    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Login successful', data: { _id: user._id, name: user.name, email: user.email, token } });
  } catch (error) { next(error); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt } });
  } catch (error) { next(error); }
};

const logoutUser = async (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    const user = req.user;
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Please provide your email' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });

    if (user.authProvider === 'google' && !user.password)
      return res.status(400).json({ success: false, message: 'This account uses Google sign-in. No password to reset.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();


    // Use updateOne to bypass the pre-save middleware
await User.updateOne(
  { _id: user._id },
  {
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpire: user.resetPasswordExpire,
  }
);

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendResetEmail(user.email, resetURL);
    logger.info(`Password reset email sent to: ${user.email}`);

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
  } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
  try {
    console.log('=== RESET HIT ===');
    console.log('Body:', req.body);
    const { token, password } = req.body;
    console.log('Token:', token);
    console.log('Password:', password);
    if (!token || !password)
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);
    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) { next(error); }

  
};
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });

    const updateData = { name: name.trim() };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Profile updated for: ${user.email}`);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt }
    });
  } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    if (currentPassword === newPassword)
      return res.status(400).json({ success: false, message: 'New password must be different from current' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    if (user.authProvider === 'google' && !user.password)
      return res.status(400).json({ success: false, message: 'Google accounts cannot change password here' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for: ${user.email}`);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};
module.exports = { registerUser, loginUser, getMe, logoutUser, googleCallback, forgotPassword, resetPassword, updateProfile, changePassword };