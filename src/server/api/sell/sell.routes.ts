import { createSellOrder, getSellOrders, editSellOrder } from './sell.controllers';
import express from 'express';

const router = express.Router();

router.get('/', getSellOrders);

router.put('/', editSellOrder);

router.post('/', createSellOrder);

export = router;
