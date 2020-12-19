import { SendProductJob } from './schema';
import { sendWithdrawTrade } from '../bot/bot';
import logger from '../logger/winston';
import { Worker } from 'bullmq';

const sendProductProcessor = new Worker(
  'SendOrders',
  async (job: { data: SendProductJob }) => {
    sendWithdrawTrade(
      job.data.tradeUrl,
      job.data.assetId,
      job.data.appId,
      job.data.contextId,
      (err: Error, status: string, offerId: string) => {
        if (err) {
          logger.error(`sendDepositTradeError : ${err.message}`);
          return;
        }
        logger.debug(
          `send product to user ${job.data.tradeUrl}, offer: ${offerId}, status: ${status}`,
        );
      },
    );
  },
  {
    connection: {
      host: process.env.REDIS_QUEUE_URL,
      port: 6379,
    },
  },
);

export = sendProductProcessor;
