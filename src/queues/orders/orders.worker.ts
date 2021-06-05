import { SendProductJob } from './types';
import { sendWithdrawTrade } from '../../bot/bot';
import logger from '../../common/logger/winston';
import { ordersQueueName } from '../../config/orders.queue';
import { host, password, port } from '../../config/redis';
import { Worker } from 'bullmq';

class OrdersWorker {
  readonly redisURL: string = host;
  readonly port: number = port;
  readonly password: string = password;
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
          host: this.redisURL,
          port: this.port,
          password: this.password,
        },
      },
    );
  }

  stopWorker(): void {
    void this.sendOrdersProcessor.close();
  }
}

export { OrdersWorker };
