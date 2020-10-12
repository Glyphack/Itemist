import { Request, Response } from 'express';
import Product from '../../models/product.model';

async function getProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find({});
  res.send(products);
}

export { getProducts };
