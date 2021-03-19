import Product from './product.model';
import { Request, Response } from 'express';

async function getProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find({ isAvailable: true }).select('-__v -seller');
  res.json(products);
}

export { getProducts };
