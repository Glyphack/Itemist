import express, { Response } from 'express';

import { getUserInventory } from '../../bot/bot';
import { AuthenticatedRequest } from '../../types/request';
import { getUserBySteamId, UpdateUserTradeUrl } from './profile.services';

const router = express.Router();

router.get('', async (req: AuthenticatedRequest, res: Response) => {
  const user = await getUserBySteamId(req.user.steamId);
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
    name: user.name,
    avatar: user.avatar,
  });
});

router.put('', async (req: AuthenticatedRequest, res) => {
  const user = await UpdateUserTradeUrl(req.user.steamId, req.body.tradeUrl);
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
    name: user.name,
    avatar: user.avatar,
  });
});

router.get('/inventory', async (req: AuthenticatedRequest, res) => {
  const inventory = await getUserInventory(req.user.steamId, 570, 2, true);
  res.json({ inventory });
});

export = router;
