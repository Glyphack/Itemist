import { Queue, QueueScheduler } from 'bullmq';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// it is used for delayed jobs in ordersQueue
const ordersQueueScheduler = new QueueScheduler('SendOrders', {
  connection: {
    host: process.env.REDIS_QUEUE_URL,
    port: 6379,
  },
});

const ordersQueue = new Queue('SendOrders', {
  connection: {
    host: process.env.REDIS_QUEUE_URL,
    port: 6379,
  },
});

export = ordersQueue;
