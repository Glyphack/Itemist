import express from 'express';
import { getProducts } from './products.controllers';

const router = express.Router();

/*
  Returns all products
*/
router.get('/', getProducts);

export default router;
