import { SendProductJob } from './types';
import { sendWithdrawTrade } from '../../bot/bot';
import logger from '../../common/logger/winston';
import { Worker } from 'bullmq';

const sendProductProcessor = new Worker(
  'SendOrders',
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

export = sendProductProcessor;
