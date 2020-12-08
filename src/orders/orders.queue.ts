import { OrderJob } from './schema';
import { Queue, QueueScheduler } from 'bullmq';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// it is used for delayed jobs in ordersQueue
const ordersQueueScheduler = new QueueScheduler('SendOrders');

const ordersQueue = new Queue('SendOrders', {
  connection: {
    host: process.env.REDIS_CACHE_URL,
    port: 6379,
    password: process.env.REDIS_CACHE_PASS,
  },
});

export = ordersQueue;
