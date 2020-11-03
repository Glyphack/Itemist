import { Router } from 'express';
import {
  getUserInventoryController,
  getUserProfile,
  updateUserProfile,
} from './profile.controllers';

const router = Router();

router.get('', getUserProfile);

router.put('', updateUserProfile);

router.get('/inventory', getUserInventoryController);

export default router;
