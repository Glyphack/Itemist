/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import logger from '../common/logger/winston';
import SellOrderModel from '../server/api/sell/sellOrder.model';
import TradeOffer from '../models/tradeOffer.model';
import createProductFromSellOrder from '../server/api/products/products.services';
import RawItem from '../types/steamItem';
import { TradeOfferItemInfo } from '../queues/orders/types';
import UserModel from '../server/api/profile/profile.model';
import SteamUser from 'steam-user';
import SteamTotp from 'steam-totp';
import SteamCommunity from 'steamcommunity';
import TradeOfferManager from 'steam-tradeoffer-manager';
import * as Sentry from '@sentry/node';
import util from 'util';

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community,
  language: 'en',
  domain: 'itemist.ir',
});

if (process.env.NODE_ENV === 'production') {
  const logInOptions = {
    accountName: process.env.STEAM_ACCOUNT_NAME,
    password: process.env.STEAM_ACCOUNT_PASSWORD,
    twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_ACCOUNT_SHARED_SECRET),
  };
  client.logOn(logInOptions);
}

client.on('loggedOn', () => {
  logger.info('logged on');

  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(359550);
});

client.on('webSession', (sid, cookies) => {
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(20000, process.env.STEAM_IDENTITY_SECRET);
});

community.on('sessionExpired', (err) => {
  logger.error(`not logged in ${err}`);
  Sentry.captureException(err);
  client.webLogOn();
});

async function getUserInventory(
  userSteamId: string,
  appId: number,
  contextId: number,
  tradableOnly: boolean,
): Promise<RawItem[]> {
  const getUserInventoryContentsPromise = util.promisify(
    manager.getUserInventoryContents.bind(manager),
  );
  return getUserInventoryContentsPromise(userSteamId, appId, contextId, tradableOnly);
}

async function getBotInventory(
  appId: string,
  contextId: string,
  tradableOnly: boolean,
): Promise<RawItem[]> {
  const getInventoryContentsPromise = util.promisify(manager.getInventoryContents.bind(manager));
  return getInventoryContentsPromise(appId, contextId, tradableOnly);
}

function sendDepositTrade(steamId: string, tradeUrl: string, assetid: string, callback): void {
  const offer = manager.createOffer(tradeUrl);
  client.webLogOn();
  manager.getUserInventoryContents(steamId, 570, 2, true, (err, inv) => {
    if (err) {
      logger.log(err);
      callback(new Error('Could not get inventory'), false);
    }
    const item = inv.find((i) => i.assetid === assetid);
    if (!item) {
      callback(new Error('Could not find item'), false);
    }
    offer.addTheirItem(item);
    offer.setMessage('Deposit item on the website!');
    offer.send((err, status) => {
      callback(err, status === 'sent' || status === 'pending', offer.id);
    });
  });
}

async function sendWithdrawTrade(tradeUrl: string, items: TradeOfferItemInfo[]): Promise<void> {
  const offer = this.manager.createOffer(tradeUrl);
  client.webLogOn();
  await Promise.all(
    items.map(async (item: TradeOfferItemInfo) => {
      try {
        const inv = await getBotInventory(item.appId, item.contextId, true);
        const foundItem = inv.find((i) => i.assetid === item.assetId);
        if (!foundItem) {
          throw new Error('Could not find item');
        }
        offer.addMyItem(foundItem);
        offer.setMessage('Itemeto begir boro');
      } catch (err) {
        if (err instanceof Error) logger.error('error sending trade offer', err);
      }
    }),
  );

  const user = await UserModel.findOne({ tradeUrl: tradeUrl });
  offer.send((err: any, status: 'failed' | 'sent' | 'successful') => {
    if (err) logger.error(`Error in sending trade offer ${err}`);
    logger.debug(`send product to user ${tradeUrl}, offer: ${offer.id}`);
    void TradeOffer.create({ user, offerId: offer.id, tradeStatus: status });
  });
}

export { getUserInventory, getBotInventory, sendDepositTrade, sendWithdrawTrade, manager };

manager.on('newOffer', (offer) => {
  logger.info(`New offer #${offer.id} from ${offer.partner.getSteam3RenderedID()}`);
});

async function handleTradeOfferStateChanged(offer, oldState) {
  logger.info(`offer with old state ${oldState} changed`);
  const offerId = offer.id;
  const tradeOffer = await TradeOffer.findOne({ offerId });
  const sellOrder = await SellOrderModel.findOne({ tradeOffer });

  // if state is not 3 then trade is failed
  if (offer.state !== 3) {
    tradeOffer.tradeStatus = 'failed';
    await tradeOffer.save();
    return;
  }
  tradeOffer.tradeStatus = 'successful';
  await tradeOffer.save();
  offer.getReceivedItems(async (err, items) => {
    if (err) {
      logger.error(`error processing tradeoffer ${tradeOffer}`);
      return;
    }
    let item = items[0];
    const inventory = await getBotInventory(sellOrder.appId, sellOrder.contextId, false);
    item = inventory.find((i) => i.assetid === item.assetid);
    if (item === undefined) {
      logger.error(`Could not find Item for ${sellOrder} with id ${item.assetid} in inventory`);
    }
    await createProductFromSellOrder(sellOrder, item);
  });
  sellOrder.success = true;
  sellOrder.state = 'for-sell';
  await sellOrder.save();
}

manager.on('sentOfferChanged', handleTradeOfferStateChanged);
