const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation failed',
      details: Object.values(err.errors).map((error) => error.message)
    });
    return;
  }

  if (err.name === 'MulterError' || err.message?.startsWith('Invalid ')) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: err.message });
    return;
  }

  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

export default errorHandler;
