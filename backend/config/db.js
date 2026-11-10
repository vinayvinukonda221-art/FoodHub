import mongoose from 'mongoose';

let memoryServerInstance = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodiehub';

  // 1. Try specified MONGO_URI with short timeout
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(`[Notice] Could not connect to MongoDB at ${mongoUri} (${err.message}).`);
    console.log('[Notice] Starting embedded in-memory MongoDB server for zero-setup execution...');
  }

  // 2. Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'foodiehub'
      }
    });
    const inMemoryUri = memoryServerInstance.getUri();
    const conn = await mongoose.connect(inMemoryUri);
    console.log(`[In-Memory MongoDB Server Active]: ${inMemoryUri}`);
    return conn;
  } catch (error) {
    console.error(`[Fatal MongoDB Error]: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
