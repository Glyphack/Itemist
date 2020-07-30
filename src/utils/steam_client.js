const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const winston = require('../config/winston');

const client = new SteamUser();

const logOnOptions = {
  accountName: process.env.STEAM_ACOUNT_NAME,
  password: process.env.STEAM_ACOUNT_PASSWORD,
  twoFactorCode: SteamTotp.generateAuthCode(
    process.env.STEAM_ACCOUNT_SHARED_SECRET,
  ),
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  winston.info('Logged into Steam');

  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(440);
});

module.exports = client;