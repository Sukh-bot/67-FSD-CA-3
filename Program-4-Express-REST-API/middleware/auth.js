/**
 * JWT Authentication Middleware
 * Enforces Protected Routes using signed JSON Web Tokens
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vetcare_super_secret_jwt_key_2026_fsd';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Required',
      message: 'Missing Authorization header. Please provide a Bearer JWT token.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Malformed Token',
      message: 'Authorization header must follow format: "Bearer <token>"'
    });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or Expired Token',
        message: err.message
      });
    }

    // Attach decoded token payload (id, email, role, etc.) to request object
    req.user = decodedUser;
    next();
  });
}

module.exports = {
  authenticateJWT,
  JWT_SECRET
};
