module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific known cases
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for field: ${Object.keys(err.keyValue).join(', ')}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
