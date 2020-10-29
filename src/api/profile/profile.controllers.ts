import { getUserInventory } from '../../bot/bot';
import { getUserBySteamId } from './profile.services';
import { convertRawSteamItemToSteamItem } from '../../utils/steam/steam';

async function getUserInventory(req: GetInventoryRequest, res) {
  const inventory = await getUserInventory(req.user.steamId, 570, 2, true);
  const userInventoryResponse = inventory.map((item) => convertRawSteamItemToSteamItem(item));
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

async function updateUserProfile(req: AuthenticatedRequest, res) {
  const user = await UpdateUserTradeUrl(req.user.steamId, req.body.tradeUrl);
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
    name: user.name,
    avatar: user.avatar,
  });
}

export { getUserInventory, getUserProfile, updateUserProfile };
