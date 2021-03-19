import {
  getUserInventoryController,
  getUserProfile,
  updateUserProfile,
} from './profile.controllers';
import { Router } from 'express';

const router = Router();

router.get('', getUserProfile);

router.put('', updateUserProfile);

router.get('/inventory', getUserInventoryController);

export default router;
