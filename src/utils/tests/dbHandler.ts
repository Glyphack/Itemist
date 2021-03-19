/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from 'mongoose';

const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

async function getMongoServerUrl(): Promise<string> {
  return await mongoServer.getUri();
}

/**
 * Connect to the in-memory database.
 */
async function connectToDatabase(url?: string): Promise<void> {
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };
  try {
    await mongoose.connect(await mongoServer.getUri(), mongooseOpts);
    console.info('connected to mongodb');
  } catch (err) {
    console.info(`could not connect to Database ${err}`);
  }
}

/**
 * Drop database, close the connection and stop mongoServer.
 */
async function closeDatabase(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

/**
 * Remove all the data for all db collections.
 */
async function clearDatabase(): Promise<void> {
  // const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   const collection = collections[key];
  //   await collection.deleteMany({});
  // }
}

export { connectToDatabase, clearDatabase, closeDatabase, getMongoServerUrl };
