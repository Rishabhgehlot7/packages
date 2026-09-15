import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  MONGODB_URI not provided. Running in memory / mock mode.');
    return null;
  }

  try {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 20,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(uri, opts);
    console.log(`\x1b[32m✔ MongoDB connected successfully to ${conn.connection.name}\x1b[0m`);
    return conn;
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return null;
  }
}

export default connectDB;
