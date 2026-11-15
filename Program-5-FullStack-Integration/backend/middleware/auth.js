const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vetcare_jwt_secret_fsd_ca3_2026';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authorization header is required.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Malformed Token',
      message: 'Format must be: Bearer <token>'
    });
  }

  jwt.verify(parts[1], JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Invalid or expired token.'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateJWT,
  JWT_SECRET
};
