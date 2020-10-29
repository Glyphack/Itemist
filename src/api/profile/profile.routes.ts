import express, { Response } from 'express';
import { getUserProfile, updateUserProfile } from './profile.controllers';

import { getUserBySteamId, UpdateUserTradeUrl } from './profile.services';

const router = express.Router();

router.get('', getUserProfile);

router.put('', updateUserProfile);

router.get('/inventory', getUserInventory);

export default router;
