import { getUserInventory } from '../../bot/bot';
import { getUserBySteamId, UpdateUserTradeUrl } from './profile.services';
import { convertRawSteamItemToSteamItem } from '../../utils/steam/steam';
import { GetUserInventoryRequest } from './profile.schemas';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/request';
import logger from '../../logger/winston';

async function getUserInventoryController(req: GetUserInventoryRequest, res: Response) {
  const inventory = await getUserInventory(req.user.steamId, 570, 2, true);
  const userInventoryResponse = inventory.map((item) => convertRawSteamItemToSteamItem(item));
  if (req.query.name !== undefined) {
    logger.info(req.query.name);
    const searchResults = userInventoryResponse.filter((item) =>
      item.name.includes(req.query.name),
    );
    res.json(searchResults);
    return;
  }
  res.json(userInventoryResponse);
}

async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  const user = await getUserBySteamId(req.user.steamId);
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
    name: user.name,
    avatar: user.avatar,
  });
}

async function updateUserProfile(req: AuthenticatedRequest, res: Response) {
  const user = await UpdateUserTradeUrl(req.user.steamId, req.body.tradeUrl);
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
    name: user.name,
    avatar: user.avatar,
  });
}

export { getUserInventoryController, getUserProfile, updateUserProfile };
