import { SendProductJob } from './types';
import { sendWithdrawTrade } from '../../bot/bot';
import logger from '../../common/logger/winston';
import { ordersQueueName } from '../../config/orders.queue';
import { Worker } from 'bullmq';

class OrdersWorker {
  readonly redisURL: string = process.env.REDIS_URL;
  readonly port: number = 6379;
  private sendOrdersProcessor: Worker;

  constructor(redisURL?: string) {
    if (redisURL !== undefined) {
      this.redisURL = redisURL;
    }
  }

  start(): void {
    logger.info('started orders worker');
    this.sendOrdersProcessor = new Worker(
      ordersQueueName,
      async (job: { data: SendProductJob }) => {
        try {
          await sendWithdrawTrade(job.data.tradeUrl, job.data.items);
        } catch (err) {
          if (err instanceof Error) logger.error(`sendWithdrawTradeError : ${err.message}`);
        }
      },
      {
        connection: {
          host: process.env.REDIS_URL,
          port: 6379,
        },
      },
    );
  }

  stopWorker(): void {
    void this.sendOrdersProcessor.close();
  }
}

export { OrdersWorker };
