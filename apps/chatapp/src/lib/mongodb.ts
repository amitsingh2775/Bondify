// lib/mongodb.ts
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://dearjhon977:18745@cluster0.viogx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected!');
  }
};

export default connectMongoDB;
