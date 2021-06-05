import { ordersQueueName } from '../../config/orders.queue';
import logger from '../../common/logger/winston';
import { host, password, port } from '../../config/redis';
import { Queue, QueueScheduler } from 'bullmq';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// it is used for delayed jobs in ordersQueue
class OrdersQueue {
  readonly redisURL: string = host;
  readonly port: number = port;
  readonly password: string = password;
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
        port: this.port,
        password: this.password,
      },
    });
    OrdersQueue.queue = new Queue(ordersQueueName, {
      connection: {
        host: this.redisURL,
        port: this.port,
        password: this.password,
      },
    });
  }

  stopQueue(): void {
    void OrdersQueue.queue.close();
    void this.queueScheduler.close();
  }
}

export { OrdersQueue };
