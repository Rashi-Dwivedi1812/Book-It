import 'dotenv/config';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[database]: MongoDB connected successfully.');
  } catch (error) {
    console.error('[database]: MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
