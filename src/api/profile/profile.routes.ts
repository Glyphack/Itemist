import express, { Response } from 'express';

import User from '../../models/user.model';
import { getUserInventory } from '../../utils/bot';
import { AuthenticatedRequest } from '../../types/request';

const router = express.Router();

router.get('', async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findOne({ steamId: req.user.steamId });
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
  });
});

router.put('', async (req: AuthenticatedRequest, res) => {
  const user = await User.findOneAndUpdate(
    { steamId: req.user.steamId },
    { tradeUrl: req.body.trade_url },
    { new: true },
  );
  res.json({ user });
});

router.get('/inventory', async (req: AuthenticatedRequest, res) => {
  const inventory = await getUserInventory(req.user.steamId, 570, 2, true);
  res.json({ inventory });
});

export = router;
