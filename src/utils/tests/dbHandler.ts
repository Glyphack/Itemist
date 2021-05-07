/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import logger from '../../common/logger/winston';
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
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(await mongoServer.getUri(), mongooseOpts);
  } catch (err) {
    logger.error(`could not connect to Database ${err}`);
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

export { connectToDatabase, closeDatabase, getMongoServerUrl };
