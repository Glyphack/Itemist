import { getUserBySteamId, UpdateUserTradeUrl } from './profile.services';
import { GetUserInventoryRequest, UpdateUserProfileRequest } from './profile.schemas';
import { getUserInventory } from '../../bot/bot';
import { convertRawSteamItemToSteamItem } from '../../utils/steam/steam';
import { AuthenticatedRequest } from '../../types/request';
import logger from '../../common/logger/winston';
import { Response } from 'express';
import sanitize from 'mongo-sanitize';

async function getUserInventoryController(
  req: GetUserInventoryRequest,
  res: Response,
): Promise<void> {
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

async function getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await getUserBySteamId(req.user.steamId);
  res.json({
    tradeUrl: user.tradeUrl,
    balance: user.balance,
    name: user.name,
    avatar: user.avatar,
  });
}

async function updateUserProfile(req: UpdateUserProfileRequest, res: Response): Promise<void> {
  const tradeUrl = sanitize(req.body.tradeUrl);
  const user = await UpdateUserTradeUrl(req.user.steamId, tradeUrl);
  res.json({
    tradeUrl: user.tradeUrl,
    balance: user.balance,
    name: user.name,
    avatar: user.avatar,
  });
}

export { getUserInventoryController, getUserProfile, updateUserProfile };
