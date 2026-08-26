const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;

    // Attempt standard connection with 3-second timeout
    const options = {
      serverSelectionTimeoutMS: 3000,
    };

    const conn = await mongoose.connect(connStr, options);
    console.log(`[MongoDB] Connected to Host: ${conn.connection.host}`);
  } catch (err) {
    console.log('[MongoDB] Standard connection failed or local MongoDB daemon not active.');
    console.log('[MongoDB] Launching automated In-Memory MongoDB Server for instant zero-config experience...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const mongoUri = memoryServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] In-Memory MongoDB Server Running at: ${mongoUri}`);

      // Auto-seed in-memory database
      console.log('[MongoDB] Auto-seeding catalog into In-Memory Database...');
      const { populateInitialData } = require('../../seed');
      await populateInitialData();
    } catch (memErr) {
      console.error('[MongoDB] Failed to start In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
