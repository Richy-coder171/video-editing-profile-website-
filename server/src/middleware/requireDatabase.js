import mongoose from 'mongoose';

const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database unavailable. Start MongoDB locally or set MONGODB_URI in server/.env.'
    });
    return;
  }

  next();
};

export default requireDatabase;
