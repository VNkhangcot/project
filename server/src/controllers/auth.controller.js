const User = require('../models/User');
const Role = require('../models/Role');
const { generateTokenPair, verifyRefreshToken } = require('../config/jwt');
const { 
  sendSuccess, 
  sendError, 
  sendUnauthorized, 
  sendNotFound,
  sendCreated,
  asyncHandler 
} = require('../utils/response');
const { hashPassword, comparePassword } = require('../utils/helpers');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * Register new user
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return sendError(res, 'Email already registered', 400);
  }

  // Get default role if not provided
  let userRole = role;
  if (!userRole) {
    const defaultRole = await Role.findDefault('employee');
    if (!defaultRole) {
      return sendError(res, 'Default role not found. Please contact administrator.', 500);
    }
    userRole = defaultRole._id;
  } else {
    // Verify role exists
    const roleExists = await Role.findById(userRole);
    if (!roleExists) {
      return sendError(res, 'Invalid role specified', 400);
    }
  }

  // Create user
  const user = new User({
    name,
    email,
    password,
    role: userRole,
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  await user.save();

  // Generate email verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  // await emailService.sendVerificationEmail(user.email, verificationToken);

  logger.logAuth('User registered', email, req.ip);

  // Return user without sensitive data
  const userData = await User.findById(user._id)
    .populate('role', 'name displayName permissions')
    .select('-password');

  return sendCreated(res, userData, 'User registered successfully. Please check your email for verification.');
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Find user with password field
  const user = await User.findByEmail(email)
    .select('+password')
    .populate('role', 'name displayName permissions');

  if (!user) {
    logger.logAuthError('Login failed', 'User not found', req.ip);
    return sendUnauthorized(res, 'Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked) {
    logger.logAuthError('Login failed', 'Account locked', req.ip);
    return sendUnauthorized(res, 'Account is temporarily locked due to too many failed login attempts');
  }

  // Check if account is active
  if (user.status !== 'active') {
    logger.logAuthError('Login failed', 'Account inactive', req.ip);
    return sendUnauthorized(res, 'Account is not active');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incLoginAttempts();
    logger.logAuthError('Login failed', 'Invalid password', req.ip);
    return sendUnauthorized(res, 'Invalid email or password');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const tokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role.name
  };

  const tokens = generateTokenPair(tokenPayload);

  logger.logAuth('User logged in', email, req.ip);

  // Remove sensitive data
  const userData = user.toJSON();
  delete userData.password;

  return sendSuccess(res, {
    user: userData,
    tokens
  }, 'Login successful');
});

/**
 * Logout user
 */
const logout = asyncHandler(async (req, res) => {
  // TODO: Add token to blacklist if using Redis
  // await redisClient.set(`blacklist_${token}`, 'true', 'EX', tokenExpiry);

  logger.logAuth('User logged out', req.user.email, req.ip);
  
  return sendSuccess(res, null, 'Logout successful');
});

/**
 * Refresh access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendUnauthorized(res, 'Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId)
      .populate('role', 'name displayName permissions');

    if (!user || user.status !== 'active') {
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role.name
    };

    const tokens = generateTokenPair(tokenPayload);

    logger.logAuth('Token refreshed', user.email, req.ip);

    return sendSuccess(res, tokens, 'Token refreshed successfully');

  } catch (error) {
    logger.logAuthError('Token refresh failed', error.message, req.ip);
    return sendUnauthorized(res, 'Invalid or expired refresh token');
  }
});

/**
 * Forgot password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not
    return sendSuccess(res, null, 'If the email exists, a password reset link has been sent');
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset email
  // await emailService.sendPasswordResetEmail(user.email, resetToken);

  logger.logAuth('Password reset requested', email, req.ip);

  return sendSuccess(res, null, 'If the email exists, a password reset link has been sent');
});

/**
 * Reset password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return sendError(res, 'Invalid or expired reset token', 400);
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  logger.logAuth('Password reset completed', user.email, req.ip);

  return sendSuccess(res, null, 'Password reset successful');
});

/**
 * Change password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.userId).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return sendError(res, 'Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.logAuth('Password changed', user.email, req.ip);

  return sendSuccess(res, null, 'Password changed successfully');
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate('role', 'name displayName permissions')
    .populate('enterprises', 'name code status');

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  return sendSuccess(res, user, 'Profile retrieved successfully');
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['name', 'phone', 'avatar', 'preferences'];
  const updates = {};

  // Filter allowed updates
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Update metadata
  updates['metadata.updatedBy'] = req.userId;

  const user = await User.findByIdAndUpdate(
    req.userId,
    updates,
    { new: true, runValidators: true }
  )
    .populate('role', 'name displayName permissions')
    .populate('enterprises', 'name code status');

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  logger.logAuth('Profile updated', user.email, req.ip);

  return sendSuccess(res, user, 'Profile updated successfully');
});

/**
 * Verify email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with verification token
  const user = await User.findOne({
    emailVerificationToken: hashedToken
  });

  if (!user) {
    return sendError(res, 'Invalid or expired verification token', 400);
  }

  // Update user
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  logger.logAuth('Email verified', user.email, req.ip);

  return sendSuccess(res, null, 'Email verified successfully');
});

/**
 * Resend email verification
 */
const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (user.emailVerified) {
    return sendError(res, 'Email is already verified', 400);
  }

  // Generate new verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  // await emailService.sendVerificationEmail(user.email, verificationToken);

  logger.logAuth('Verification email resent', user.email, req.ip);

  return sendSuccess(res, null, 'Verification email sent');
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  verifyEmail,
  resendVerification
};
