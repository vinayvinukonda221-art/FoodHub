import mongoose from 'mongoose';

let memoryServerInstance = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // 1. If explicit MONGO_URI is provided (e.g. MongoDB Atlas)
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      console.log('[Notice] Connecting to configured MongoDB URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000
      });
      console.log(`[MongoDB Connected]: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[Notice] Could not connect to configured MONGO_URI (${err.message}).`);
    }
  } else {
    // Try local MongoDB
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/foodiehub', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[MongoDB Connected]: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.log(`[Notice] Could not connect to local MongoDB at 127.0.0.1:27017 (${err.message}).`);
    }
  }

  // 2. Fallback to MongoMemoryServer
  console.log('[Notice] Starting embedded in-memory MongoDB server for zero-setup execution...');
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
    console.error(`\n💡 Tip: Provide a cloud MongoDB URI in your environment variables: MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/foodiehub?retryWrites=true&w=majority\n`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
