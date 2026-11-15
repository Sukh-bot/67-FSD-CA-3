function errorHandler(err, req, res, next) {
  console.error('[Error Caught]:', err.message);

  let status = 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  res.status(status).json({
    success: false,
    error: err.name || 'ServerError',
    message
  });
}

module.exports = errorHandler;
