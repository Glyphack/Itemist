/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */

import logger from '../common/logger/winston';
import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';

const { MongoMemoryServer } = require('mongodb-memory-server');

async function getMongooseConnection(): Promise<Mongoose> {
  let mongooseConnection: Mongoose;
  let url: string = process.env.MONGO_URI;
  if (process.env.NODE_ENV !== 'production') {
    logger.info('spin up in memory mongodb');
    const mongoServer = new MongoMemoryServer();
    url = await mongoServer.getUri();
  }
  try {
    mongooseConnection = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info('connected to mongodb 🔥');
  } catch (err) {
    logger.info(`could not connect to Database ${err}`);
  }
  return mongooseConnection;
}

export { getMongooseConnection };
