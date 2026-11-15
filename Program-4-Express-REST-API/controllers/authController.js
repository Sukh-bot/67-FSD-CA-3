/**
 * Authentication Controller
 * Handles user registration, bcrypt password hashing, and JWT token issuance
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/store');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Register a new staff / vet user
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'A user with this email address already exists.'
      });
    }

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'Clinic Staff',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with bcrypt password encryption.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user and issue signed JWT token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Email and password are required.'
      });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid credentials. User not found.'
      });
    }

    // Compare provided password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. JWT token issued.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Protected route: Retrieve current authenticated user profile
 */
exports.getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed successfully using verified JWT token.',
    user: req.user
  });
};
