const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamCommunity = require('steamcommunity');
const client = require('./steam_client');

const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community,
  language: 'en',
});

module.exports = { manager, community };
