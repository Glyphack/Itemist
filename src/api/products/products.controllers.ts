import { Request, Response } from 'express';
import Product from '../../models/product.model';

async function getProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find({}).select('-__v -seller');
  res.json(products);
}

export { getProducts };
