import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    console.warn('MongoDB is not connected. API will start in degraded development mode.');
    console.warn(error.message);
  }

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});
