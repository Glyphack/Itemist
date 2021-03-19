import { getProducts } from './products.controllers';
import express from 'express';

const router = express.Router();

/*
  Returns all products
*/
router.get('/', getProducts);

export default router;
