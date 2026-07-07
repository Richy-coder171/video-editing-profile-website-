import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/cinematic_portfolio' : '');

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  const connection = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
