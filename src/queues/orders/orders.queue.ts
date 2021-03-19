import { ordersQueueName } from '../../config/orders.queue';
import logger from '../../common/logger/winston';
import { Queue, QueueScheduler } from 'bullmq';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// it is used for delayed jobs in ordersQueue
class OrdersQueue {
  readonly redisURL: string = process.env.REDIS_URL;
  readonly port: number = 6379;
  public static queue: Queue;
  private queueScheduler: QueueScheduler;

  constructor(redisURL?: string) {
    if (redisURL !== undefined) {
      this.redisURL = redisURL;
    }
  }

  start(): void {
    logger.info('started orders queue');
    this.queueScheduler = new QueueScheduler(ordersQueueName, {
      connection: {
        host: this.redisURL,
        port: 6379,
      },
    });
    OrdersQueue.queue = new Queue(ordersQueueName, {
      connection: {
        host: process.env.REDIS_URL,
        port: 6379,
      },
    });
  }

  stopQueue(): void {
    void OrdersQueue.queue.close();
    void this.queueScheduler.close();
  }
}

export { OrdersQueue };
