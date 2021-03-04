import { SendProductJob } from './schema';
import { sendWithdrawTrade } from '../bot/bot';
import logger from '../logger/winston';
import TradeOfferModel from '../models/tradeOffer.model';
import UserModel from '../models/user.model';
import { Worker } from 'bullmq';

const sendProductProcessor = new Worker(
  'SendOrders',
  async (job: { data: SendProductJob }) => {
    try {
      const offerId = await sendWithdrawTrade(job.data.tradeUrl, job.data.items);
      logger.debug(`send product to user ${job.data.tradeUrl}, offer: ${offerId}`);
      const user = await UserModel.findOne({ tradeUrl: job.data.tradeUrl });
      void TradeOfferModel.create({ user, offerId: offerId });
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
