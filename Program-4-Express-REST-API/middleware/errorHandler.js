/**
 * Centralized Error Handling Middleware
 * Intercepts uncaught errors, malformed JSON, and runtime exceptions
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

function errorHandler(err, req, res, next) {
  console.error('\x1b[31m[CENTRALIZED ERROR HANDLER]\x1b[0m', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

// 404 Catch-All Route Middleware
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Route does not exist on this Express API.`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
