const util = require('util')

const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamCommunity = require('steamcommunity');
const SteamTotp = require('steam-totp');
const SteamUser = require('steam-user');

const {logger} = require('../config/winston');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en',
  'domain': 'itemist.ir',
});

const logInOptions = {
  accountName: process.env.STEAM_ACCOUNT_NAME,
  password: process.env.STEAM_ACCOUNT_PASSWORD,
  twoFactorCode: SteamTotp.generateAuthCode(
    process.env.STEAM_ACCOUNT_SHARED_SECRET,
  ),
};

client.logOn(logInOptions);

client.on('loggedOn', () => {
  console.log('logged on');

  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(359550);
});

client.on('webSession', (sid, cookies) => {
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(20000, process.env.STEAM_IDENTITY_SECRET);
});

community.on("sessionExpired", function (err) {
  console.error(`not logged in ${err}`);
  client.webLogOn();
});

async function getUserInventory(userSteamId, appId, contextId, tradableOnly) {
  const getUserInventoryContentsPromise = util.promisify(manager.getUserInventoryContents.bind(manager));
  return await getUserInventoryContentsPromise(userSteamId, appId, contextId, tradableOnly);
}

async function getBotInventory(appId, contextId, tradableOnly) {
  const getInventoryContentsPromise = util.promisify(manager.getInventoryContents.bind(manager));
  return await getInventoryContentsPromise(appId, contextId, tradableOnly);
}

function sendDepositTrade(partner, assetid, callback) {
  const offer = manager.createOffer(partner);

  manager.getUserInventoryContents(partner, 570, 2, true, (err, inv) => {
    if (err) {
      console.log(err);
    } else {
      const item = inv.find((item) => item.assetid === assetid);

      if (item) {
        offer.addTheirItem(item);
        offer.setMessage('Deposit item on the website!');
        offer.send((err, status) => {
          callback(err, (status === 'sent' || status === 'pending'), offer.id);
        });
      } else {
        callback(new Error('Could not find item'), false);
      }
    }
  });
}

function sendWithdrawTrade(partner, credits, assetid, callback) {
  const offer = this.manager.createOffer(partner);

  this.manager.getInventoryContents(570, 2, true, (err, inv) => {
    if (err) {
      console.log(err);
    } else {
      const item = inv.find((item) => item.assetid === assetid);

      if (item) {

        // Check to make sure the user can afford the item here

        offer.addMyItem(item);
        offer.setMessage('Withdraw item from the website!');
        offer.send((err, status) => {
          callback(err, (status === 'sent' || status === 'pending'), offer.id);
        });
      } else {
        callback(new Error('Could not find item'), false);
      }
    }
  });
}

module.exports = {getUserInventory, getBotInventory, sendDepositTrade, sendWithdrawTrade, manager};


const {SellOrder} = require("../models/sellOrder.model");
const {TradeOffer} = require("../models/tradeOffer.model");

manager.on('newOffer', function (offer) {
  console.log("New offer #" + offer.id + " from " + offer.partner.getSteam3RenderedID());
  offer.accept(function (err, status) {
    if (err) {
      console.log("Unable to accept offer: " + err.message);
    } else {
      console.log("Offer accepted: " + status);
      if (status == "pending") {
        community.acceptConfirmationForObject(process.env.STEAM_ACCOUNT_SHARED_SECRET, offer.id, function (err) {
          if (err) {
            console.log("Can't confirm trade offer: " + err.message);
          } else {
            console.log("Trade offer " + offer.id + " confirmed");
          }
        });
      }
    }
  });
});

manager.on('sentOfferChanged', async (offer, oldState) => {
  logger.info(`offer with old state ${oldState} changed`);
  const offerId = offer.id;
  let tradeOffer = await TradeOffer.findOne({offerId: offerId});
  let sellOrder = await SellOrder.findOne({tradeOffer: tradeOffer});
  if (offer.state === 3){
    tradeOffer.tradeStatus = 'Succesful';
    sellOrder.success = true;
  } else {
    tradeOffer.tradeStatus = 'Failed';
  }
  tradeOffer.save();
  sellOrder.save();
})
