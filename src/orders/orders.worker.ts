import { SendProductJob } from './schema';
import { sendWithdrawTrade } from '../bot/bot';
import logger from '../logger/winston';
import { Worker } from 'bullmq';

const sendProductProcessor = new Worker('SendOrders', async (job: { data: SendProductJob }) => {
  sendWithdrawTrade(
    job.data.toSteamId,
    job.data.assetId,
    job.data.appId,
    job.data.contextId,
    (err: Error, status: string, offerId: string) => {
      if (err) {
        logger.error(`sendDepositTradeError : ${err.message}`);
        return;
      }
      logger.debug(
        `send product to user ${job.data.toSteamId}, offer: ${offerId}, status: ${status}`,
      );
    },
  );
});

export = sendProductProcessor;
