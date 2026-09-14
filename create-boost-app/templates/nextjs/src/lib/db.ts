import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI not defined. Operating with fallback in-memory database.');
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 50,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== 'production',
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then(async (mongooseInstance) => {
        console.log('⚡ MongoDB High-Throughput Connection Initialized');
        try {
          const ordersColl = mongooseInstance.connection.collection('orders');
          const indexes = await ordersColl.indexes();
          const orderIdIdx = indexes.find((i: any) => i.name === 'orderId_1');
          if (orderIdIdx) {
            await ordersColl.dropIndex('orderId_1');
            console.log('🧹 Cleaned legacy index orderId_1 from orders collection');
          }
        } catch (idxErr) {
          // Index might not exist or already dropped
        }
        try {
          const productsColl = mongooseInstance.connection.collection('products');
          const pIndexes = await productsColl.indexes();
          const slugIdx = pIndexes.find((i: any) => i.name === 'slug_1');
          if (slugIdx) {
            await productsColl.dropIndex('slug_1');
            console.log('🧹 Cleaned legacy index slug_1 from products collection');
          }
        } catch (pIdxErr) {
          // Index might not exist or already dropped
        }
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export { dbConnect as connectDB };
export default dbConnect;

